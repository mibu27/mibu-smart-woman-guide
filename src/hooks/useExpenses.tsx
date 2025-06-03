
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch expenses for a specific date
  const fetchExpenses = async (date?: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const targetDate = date || new Date().toISOString().split('T')[0];
      
      const { data: expensesData, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (expensesData) {
        setExpenses(expensesData);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error("Gagal memuat data pengeluaran");
    } finally {
      setLoading(false);
    }
  };

  // Add new expense
  const addExpense = async (amount: number, description: string, category: string = 'belanja') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount,
          description,
          category,
          date: today
        });

      if (error) throw error;

      toast.success("Pengeluaran berhasil ditambahkan");
      
      // Refresh expenses list
      await fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error("Gagal menambahkan pengeluaran");
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Pengeluaran berhasil dihapus");
      
      // Refresh expenses list
      await fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error("Gagal menghapus pengeluaran");
    }
  };

  // Calculate total expenses for today
  const getTotalExpenses = (targetDate?: string) => {
    const today = targetDate || new Date().toISOString().split('T')[0];
    return expenses
      .filter(expense => expense.date === today)
      .reduce((total, expense) => total + Number(expense.amount), 0);
  };

  // Get expenses by category
  const getExpensesByCategory = (category: string) => {
    return expenses.filter(expense => expense.category === category);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    deleteExpense,
    getTotalExpenses,
    getExpensesByCategory
  };
};
