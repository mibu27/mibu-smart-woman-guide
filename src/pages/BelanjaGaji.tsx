
import React, { useState, useEffect } from 'react';
import { Save, Edit, BadgeDollarSign, TrendingUp, Trash2, Plus } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

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
interface MandatoryExpense {
  id: number;
  name: string;
  amount: number;
  category: string;
  dbId?: string; // Add dbId as optional property
}

const BelanjaGaji = () => {
  const [gajiBulanan, setGajiBulanan] = useState<string>('');
  const [totalBelanjaWajib, setTotalBelanjaWajib] = useState<number>(0);
  const [batasHarian, setBatasHarian] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<number | null>(null);

  // Initialize with empty array
  const [mandatoryExpenses, setMandatoryExpenses] = useState<MandatoryExpense[]>([]);

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
          data: {
            user
          }
        } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch budget settings
          const {
            data: budgetData,
            error: budgetError
          } = await supabase.from('budget_settings').select('monthly_salary, fixed_expenses').eq('user_id', user.id).single();
          
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
          } = await supabase.from('fixed_expenses').select('*').eq('user_id', user.id);
          
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

  // Form for adding new mandatory expense
  const form = useForm<z.infer<typeof mandatoryExpenseSchema>>({
    resolver: zodResolver(mandatoryExpenseSchema),
    defaultValues: {
      name: "",
      amount: ""
    }
  });

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

  const onSubmit = async (data: z.infer<typeof mandatoryExpenseSchema>) => {
    try {
      setLoading(true);
      
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }
      
      // Parse the amount from formatted string
      const amountValue = parseIDRToNumber(data.amount);
      
      // Save to Supabase
      const { data: expenseData, error } = await supabase.from('fixed_expenses').insert({
        user_id: user.id,
        description: data.name,
        amount: amountValue
      }).select();
      
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
      const { error } = await supabase.from('fixed_expenses').update({
        description: name,
        amount: amount
      }).eq('id', expenseToUpdate.dbId);
      
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
      const { error } = await supabase.from('fixed_expenses').delete().eq('id', expenseToDelete.dbId);
      
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
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      // Check if record exists
      const {
        data: existingData
      } = await supabase.from('budget_settings').select('id').eq('user_id', user.id);
      let result;
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase.from('budget_settings').update({
          monthly_salary: monthlyIncome,
          updated_at: new Date().toISOString()
        }).eq('user_id', user.id);
      } else {
        // Insert new record
        result = await supabase.from('budget_settings').insert({
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
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      // Update fixed_expenses with the total mandatory expenses
      const {
        error
      } = await supabase.from('budget_settings').update({
        fixed_expenses: totalBelanjaWajib,
        updated_at: new Date().toISOString()
      }).eq('user_id', user.id);
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

  // Group expenses by category for better display
  const expensesByCategory = mandatoryExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<string, typeof mandatoryExpenses>);

  const cancelEdit = () => {
    setEditMode(null);
    setShowAddForm(false);
    form.reset();
  };

  return (
    <MainLayout title="Pengaturan Gaji & Belanja Wajib">
      <div className="space-y-6 animate-fade-in">
        <section>
          <h2 className="text-lg font-medium mb-3">Gaji Bulanan</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="gaji-bulanan">Gaji Bulanan (Rp)</Label>
                <div className="flex gap-2 items-center mt-1">
                  <BadgeDollarSign className="text-mibu-purple" />
                  <Input 
                    id="gaji-bulanan" 
                    type="text"
                    value={gajiBulanan} 
                    onChange={handleGajiChange} 
                    placeholder="Masukkan gaji bulanan" 
                    className="flex-1" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveIncome} disabled={loading}>
                  <Save className="mr-2" size={18} />
                  {loading ? "Menyimpan..." : "Simpan Gaji"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Belanja Wajib Bulanan</h2>
            <Button 
              variant="outline" 
              onClick={() => {
                if (!showAddForm) {
                  setShowAddForm(true);
                  setEditMode(null);
                  form.reset();
                } else {
                  cancelEdit();
                }
              }} 
              className="text-mibu-purple border-mibu-purple"
            >
              {showAddForm ? (
                <>Batal</>
              ) : (
                <><Plus size={16} className="mr-1" /> Tambah Pengeluaran</>
              )}
            </Button>
          </div>
          
          {showAddForm && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(editMode !== null ? handleUpdate : onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField 
                        control={form.control} 
                        name="name" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Pengeluaran</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Listrik, Air, dll" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <FormField 
                        control={form.control} 
                        name="amount" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah (Rp)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="0" 
                                {...field} 
                                onChange={(e) => {
                                  const formatted = formatToIDR(e.target.value);
                                  field.onChange(formatted);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      {editMode !== null && (
                        <Button type="button" variant="outline" onClick={cancelEdit}>
                          Batal
                        </Button>
                      )}
                      <Button type="submit">
                        {editMode !== null ? (
                          <><Save size={18} className="mr-2" /> Perbarui</>
                        ) : (
                          <><Save size={18} className="mr-2" /> Simpan Pengeluaran</>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-4">
              {Object.keys(expensesByCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(expensesByCategory).map(([category, expenses]) => (
                    <div key={category} className="border-b last:border-b-0 pb-3 last:pb-0">
                      <h3 className="font-medium text-mibu-purple mb-2">{category}</h3>
                      <ul className="space-y-2">
                        {expenses.map(expense => (
                          <li key={expense.id} className="flex justify-between items-center">
                            <span>{expense.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Rp {formatToIDR(expense.amount)}
                              </span>
                              <button 
                                onClick={() => handleEdit(expense.id)} 
                                className="p-1 text-gray-500 hover:text-mibu-purple"
                                aria-label="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(expense.id)} 
                                className="p-1 text-gray-500 hover:text-red-500"
                                aria-label="Hapus"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3 flex justify-between text-lg font-medium">
                    <span>Total Belanja Wajib</span>
                    <span className="text-mibu-purple">
                      Rp {formatToIDR(totalBelanjaWajib)}
                    </span>
                  </div>
                  
                  {/* Save Button for Total Mandatory Expenses */}
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleSaveAllExpenses} 
                      className="bg-mibu-purple hover:bg-mibu-darkpurple" 
                      disabled={loading}
                    >
                      <Save size={18} className="mr-2" />
                      {loading ? "Menyimpan..." : "Simpan Total Belanja Wajib"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Belum ada pengeluaran wajib yang ditambahkan
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        
        <section>
          <h2 className="text-lg font-medium mb-3">Batas Belanja Harian</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="text-center p-4 bg-mibu-lightgray rounded-lg">
                <div className="text-sm text-mibu-gray mb-1">Batas Belanja Harian Anda</div>
                <div className="text-2xl font-bold text-mibu-purple">
                  Rp {formatToIDR(batasHarian)}
                </div>
                <div className="text-xs text-mibu-gray mt-1">
                  Dihitung dari: (Gaji Bulanan - Total Belanja Wajib) ÷ Jumlah hari dalam bulan ini
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>0</span>
                  <span>
                    Rp {formatToIDR(parseIDRToNumber(gajiBulanan || '0') / 30)}
                  </span>
                </div>
                <Progress 
                  value={batasHarian / (parseIDRToNumber(gajiBulanan || '0') / 30) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <h2 className="text-lg font-medium mb-3">Sukses Hemat</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp size={32} className="text-green-500" />
                <div>
                  <div className="text-sm text-mibu-gray">Potensi Tabungan Bulanan</div>
                  <div className="text-xl font-bold text-green-500">
                    Rp {formatToIDR(savings)}
                  </div>
                </div>
              </div>
              
              {savings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
                  Hebat! Dengan pengaturan ini, Anda berpotensi menabung hingga{" "}
                  <span className="font-medium">
                    Rp {formatToIDR(savings * 12)}
                  </span>{" "}
                  dalam setahun.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default BelanjaGaji;
