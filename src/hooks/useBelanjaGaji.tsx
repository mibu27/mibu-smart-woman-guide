
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define form schema for mandatory expenses
const mandatoryExpenseSchema = z.object({
  name: z.string().min(1, {
    message: "Nama pengeluaran harus diisi"
  }),
  amount: z.string().refine(val => {
    // Remove non-numeric characters for validation
    const numericValue = val.replace(/\D/g, '');
    return !isNaN(Number(numericValue)) && Number(numericValue) > 0;
  }, {
    message: "Jumlah harus berupa angka positif"
  })
});

// Define type for mandatory expenses
export interface MandatoryExpense {
  id: number;
  name: string;
  amount: number;
  category: string;
  dbId?: string;
}

export type BelanjaGajiForm = z.infer<typeof mandatoryExpenseSchema>;

export const useBelanjaGaji = () => {
  const [gajiBulanan, setGajiBulanan] = useState<string>('');
  const [totalBelanjaWajib, setTotalBelanjaWajib] = useState<number>(0);
  const [batasHarian, setBatasHarian] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [mandatoryExpenses, setMandatoryExpenses] = useState<MandatoryExpense[]>([]);
  
  // Initialize form
  const form = useForm<BelanjaGajiForm>({
    resolver: zodResolver(mandatoryExpenseSchema),
    defaultValues: {
      name: "",
      amount: ""
    }
  });

  // Format number as IDR
  const formatToIDR = (value: string | number): string => {
    if (typeof value === 'string') {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      if (!numericValue) return '';
      
      // Format with thousand separators
      return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
    } else {
      return new Intl.NumberFormat('id-ID').format(value);
    }
  };

  // Parse IDR formatted string back to number
  const parseIDRToNumber = (value: string): number => {
    // Remove all non-numeric characters
    return parseInt(value.replace(/\D/g, '')) || 0;
  };

  // Handle gaji input change with formatting
  const handleGajiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '') {
      setGajiBulanan('');
    } else {
      setGajiBulanan(formatToIDR(numericValue));
    }
  };

  // Fetch budget settings and mandatory expenses from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch budget settings
          const {
            data: budgetData,
            error: budgetError
          } = await supabase
            .from('budget_settings')
            .select('monthly_salary, fixed_expenses')
            .eq('user_id', user.id)
            .single();
          
          if (budgetError && budgetError.code !== 'PGRST116') {
            // PGRST116 means no rows returned
            throw budgetError;
          }
          
          if (budgetData) {
            if (budgetData.monthly_salary) {
              setGajiBulanan(formatToIDR(budgetData.monthly_salary));
            }
            if (budgetData.fixed_expenses !== null) {
              setTotalBelanjaWajib(budgetData.fixed_expenses);
            }
          }
          
          // Fetch mandatory expenses from fixed_expenses table
          const {
            data: expensesData,
            error: expensesError
          } = await supabase
            .from('fixed_expenses')
            .select('*')
            .eq('user_id', user.id);
          
          if (expensesError) {
            throw expensesError;
          }
          
          if (expensesData && expensesData.length > 0) {
            const formattedExpenses = expensesData.map((expense, index) => ({
              id: index + 1, // Use index as id for the UI
              name: expense.description,
              amount: parseFloat(expense.amount.toString()),
              category: "Lainnya",
              dbId: expense.id // Keep the database ID for updates/deletes
            }));
            setMandatoryExpenses(formattedExpenses);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Gagal memuat data");
      }
    };
    
    fetchData();
  }, []);

  // Calculate total mandatory expenses
  useEffect(() => {
    const total = mandatoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalBelanjaWajib(total);
  }, [mandatoryExpenses]);

  // Calculate daily spending limit
  useEffect(() => {
    if (gajiBulanan) {
      const monthlyIncome = parseIDRToNumber(gajiBulanan);
      const currentDate = new Date();
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const dailyLimit = (monthlyIncome - totalBelanjaWajib) / daysInMonth;
      setBatasHarian(Math.max(0, dailyLimit));

      // Calculate sample savings (20% of remaining money)
      const potentialSavingsPerMonth = monthlyIncome - totalBelanjaWajib;
      setSavings(Math.max(0, potentialSavingsPerMonth * 0.2));
    }
  }, [gajiBulanan, totalBelanjaWajib]);

  const onSubmit = async (data: BelanjaGajiForm) => {
    try {
      setLoading(true);
      
      const {
        data: { user }
      } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }
      
      // Parse the amount from formatted string
      const amountValue = parseIDRToNumber(data.amount);
      
      // Save to Supabase
      const { data: expenseData, error } = await supabase
        .from('fixed_expenses')
        .insert({
          user_id: user.id,
          description: data.name,
          amount: amountValue
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Add to local state with the returned database ID
      const newExpense: MandatoryExpense = {
        id: mandatoryExpenses.length + 1,
        name: data.name,
        amount: amountValue,
        category: "Lainnya",
        dbId: expenseData[0].id
      };
      
      setMandatoryExpenses([...mandatoryExpenses, newExpense]);
      form.reset();
      setShowAddForm(false);
      toast.success("Pengeluaran wajib berhasil ditambahkan");
      
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error("Gagal menambahkan pengeluaran wajib");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    setEditMode(id);
    const expense = mandatoryExpenses.find(item => item.id === id);
    if (expense) {
      form.setValue("name", expense.name);
      form.setValue("amount", formatToIDR(expense.amount));
      setShowAddForm(true);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      if (editMode === null) return;
      
      const expenseToUpdate = mandatoryExpenses.find(item => item.id === editMode);
      if (!expenseToUpdate || !expenseToUpdate.dbId) return;
      
      const name = form.getValues("name");
      const amount = parseIDRToNumber(form.getValues("amount"));
      
      // Update in Supabase
      const { error } = await supabase
        .from('fixed_expenses')
        .update({
          description: name,
          amount: amount
        })
        .eq('id', expenseToUpdate.dbId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setMandatoryExpenses(mandatoryExpenses.map(item => 
        item.id === editMode ? { ...item, name, amount } : item
      ));
      
      form.reset();
      setShowAddForm(false);
      setEditMode(null);
      toast.success("Pengeluaran wajib berhasil diperbarui");
      
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error("Gagal memperbarui pengeluaran wajib");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const expenseToDelete = mandatoryExpenses.find(item => item.id === id);
      if (!expenseToDelete || !expenseToDelete.dbId) return;
      
      // Delete from Supabase
      const { error } = await supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', expenseToDelete.dbId);
      
      if (error) {
        throw error;
      }
      
      // Remove from local state
      setMandatoryExpenses(mandatoryExpenses.filter(item => item.id !== id));
      toast.success("Pengeluaran wajib berhasil dihapus");
      
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error("Gagal menghapus pengeluaran wajib");
    }
  };

  const handleSaveIncome = async () => {
    if (!gajiBulanan) {
      toast.error("Gaji bulanan harus diisi");
      return;
    }
    
    const monthlyIncome = parseIDRToNumber(gajiBulanan);
    if (monthlyIncome <= 0) {
      toast.error("Gaji bulanan harus lebih dari 0");
      return;
    }
    
    try {
      setLoading(true);
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      // Check if record exists
      const {
        data: existingData
      } = await supabase
        .from('budget_settings')
        .select('id')
        .eq('user_id', user.id);
      
      let result;
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('budget_settings')
          .update({
            monthly_salary: monthlyIncome,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Insert new record
        result = await supabase
          .from('budget_settings')
          .insert({
            user_id: user.id,
            monthly_salary: monthlyIncome
          });
      }
      if (result.error) {
        throw result.error;
      }
      toast.success("Gaji berhasil disimpan");
    } catch (error) {
      console.error('Error saving budget settings:', error);
      toast.error("Gagal menyimpan gaji");
    } finally {
      setLoading(false);
    }
  };

  // Save all mandatory expenses and total to Supabase
  const handleSaveAllExpenses = async () => {
    try {
      setLoading(true);
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      // Update fixed_expenses with the total mandatory expenses
      const { error } = await supabase
        .from('budget_settings')
        .update({
          fixed_expenses: totalBelanjaWajib,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      toast.success("Total belanja wajib berhasil disimpan");
    } catch (error) {
      console.error('Error saving fixed expenses:', error);
      toast.error("Gagal menyimpan total belanja wajib");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(null);
    setShowAddForm(false);
    form.reset();
  };

  return {
    gajiBulanan,
    totalBelanjaWajib,
    batasHarian,
    savings,
    showAddForm,
    loading,
    editMode,
    mandatoryExpenses,
    form,
    formatToIDR,
    parseIDRToNumber,
    handleGajiChange,
    onSubmit,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleSaveIncome,
    handleSaveAllExpenses,
    setShowAddForm,
    cancelEdit
  };
};
