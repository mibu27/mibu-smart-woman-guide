
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExpenseData {
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface MonthlyData {
  name: string;
  pengeluaran: number;
}

interface CategoryData {
  name: string;
  value: number;
}

export const useReportData = (period: 'weekly' | 'monthly' | 'yearly') => {
  const [expensesData, setExpensesData] = useState<ExpenseData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [budgetInfo, setBudgetInfo] = useState({ monthly_salary: 0, fixed_expenses: 0 });
  const [loading, setLoading] = useState(false);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Calculate date range based on period
      const now = new Date();
      let startDate: Date;
      
      if (period === 'weekly') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        startDate = new Date(now.getFullYear(), 0, 1);
      }

      // Use Promise.all for parallel fetching to improve performance
      const [expensesResult, budgetResult] = await Promise.all([
        // Fetch expenses for the period - only select needed columns
        supabase
          .from('expenses')
          .select('date, amount, category, description')
          .eq('user_id', user.id)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', now.toISOString().split('T')[0])
          .order('date', { ascending: true }),
        
        // Fetch budget settings - only select needed columns
        supabase
          .from('budget_settings')
          .select('monthly_salary, fixed_expenses')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (expensesResult.error) {
        console.error('Error fetching expenses:', expensesResult.error);
        return;
      }

      if (expensesResult.data) {
        setExpensesData(expensesResult.data.map(expense => ({
          date: expense.date,
          amount: Number(expense.amount),
          category: expense.category || 'belanja',
          description: expense.description
        })));

        // Calculate total expenses
        const total = expensesResult.data.reduce((sum, expense) => sum + Number(expense.amount), 0);
        setTotalExpenses(total);

        // Process data for charts
        if (period === 'weekly') {
          // Group by day for weekly view
          const dailyData = expensesResult.data.reduce((acc: { [key: string]: number }, expense) => {
            const date = new Date(expense.date);
            const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
            acc[dayName] = (acc[dayName] || 0) + Number(expense.amount);
            return acc;
          }, {});

          setMonthlyData(Object.entries(dailyData).map(([name, pengeluaran]) => ({
            name,
            pengeluaran
          })));
        } else {
          // Group by month for monthly/yearly view
          const monthlyDataMap = expensesResult.data.reduce((acc: { [key: string]: number }, expense) => {
            const date = new Date(expense.date);
            const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
            acc[monthName] = (acc[monthName] || 0) + Number(expense.amount);
            return acc;
          }, {});

          setMonthlyData(Object.entries(monthlyDataMap).map(([name, pengeluaran]) => ({
            name,
            pengeluaran
          })));
        }

        // Group by category for pie chart
        const categoryDataMap = expensesResult.data.reduce((acc: { [key: string]: number }, expense) => {
          const category = expense.category || 'belanja';
          acc[category] = (acc[category] || 0) + Number(expense.amount);
          return acc;
        }, {});

        setCategoryData(Object.entries(categoryDataMap).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        })));
      }

      // Process budget data
      if (!budgetResult.error && budgetResult.data) {
        setBudgetInfo({
          monthly_salary: Number(budgetResult.data.monthly_salary),
          fixed_expenses: Number(budgetResult.data.fixed_expenses)
        });
      }

    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return {
    expensesData,
    monthlyData,
    categoryData,
    totalExpenses,
    budgetInfo,
    loading,
    refreshData: fetchReportData
  };
};
