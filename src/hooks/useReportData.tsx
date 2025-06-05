
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorHandler } from './useErrorHandler';

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
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching report data for period:', period);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found, clearing data');
        setExpensesData([]);
        setMonthlyData([]);
        setCategoryData([]);
        setTotalExpenses(0);
        setBudgetInfo({ monthly_salary: 0, fixed_expenses: 0 });
        return;
      }

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

      console.log('Date range:', startDate.toISOString().split('T')[0], 'to', now.toISOString().split('T')[0]);

      // Use Promise.all for parallel fetching to improve performance
      const [expensesResult, budgetResult] = await Promise.all([
        supabase
          .from('expenses')
          .select('date, amount, category, description')
          .eq('user_id', user.id)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', now.toISOString().split('T')[0])
          .order('date', { ascending: true }),
        
        supabase
          .from('budget_settings')
          .select('monthly_salary, fixed_expenses')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (expensesResult.error) {
        console.error('Error fetching expenses:', expensesResult.error);
        throw expensesResult.error;
      }

      if (budgetResult.error && budgetResult.error.code !== 'PGRST116') {
        console.error('Error fetching budget:', budgetResult.error);
        throw budgetResult.error;
      }

      console.log('Expenses data:', expensesResult.data?.length || 0, 'records');
      console.log('Budget data:', budgetResult.data);

      if (expensesResult.data) {
        const processedExpenses = expensesResult.data.map(expense => ({
          date: expense.date,
          amount: Number(expense.amount),
          category: expense.category || 'belanja',
          description: expense.description
        }));
        
        setExpensesData(processedExpenses);

        // Calculate total expenses
        const total = processedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpenses(total);
        console.log('Total expenses calculated:', total);

        // Process data for charts
        if (period === 'weekly') {
          const dailyData = processedExpenses.reduce((acc: { [key: string]: number }, expense) => {
            const date = new Date(expense.date);
            const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
            acc[dayName] = (acc[dayName] || 0) + expense.amount;
            return acc;
          }, {});

          setMonthlyData(Object.entries(dailyData).map(([name, pengeluaran]) => ({
            name,
            pengeluaran
          })));
        } else {
          const monthlyDataMap = processedExpenses.reduce((acc: { [key: string]: number }, expense) => {
            const date = new Date(expense.date);
            const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
            acc[monthName] = (acc[monthName] || 0) + expense.amount;
            return acc;
          }, {});

          setMonthlyData(Object.entries(monthlyDataMap).map(([name, pengeluaran]) => ({
            name,
            pengeluaran
          })));
        }

        // Group by category for pie chart
        const categoryDataMap = processedExpenses.reduce((acc: { [key: string]: number }, expense) => {
          const category = expense.category || 'belanja';
          acc[category] = (acc[category] || 0) + expense.amount;
          return acc;
        }, {});

        setCategoryData(Object.entries(categoryDataMap).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        })));
      } else {
        setExpensesData([]);
        setMonthlyData([]);
        setCategoryData([]);
        setTotalExpenses(0);
      }

      // Process budget data
      if (budgetResult.data) {
        setBudgetInfo({
          monthly_salary: Number(budgetResult.data.monthly_salary) || 0,
          fixed_expenses: Number(budgetResult.data.fixed_expenses) || 0
        });
      } else {
        setBudgetInfo({ monthly_salary: 0, fixed_expenses: 0 });
      }

      console.log('Report data fetch completed successfully');

    } catch (error) {
      console.error('Error in fetchReportData:', error);
      const errorMessage = "Gagal memuat data laporan";
      setError(errorMessage);
      handleError(error as Error, errorMessage);
    } finally {
      setLoading(false);
    }
  }, [period, handleError]);

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
    error,
    refreshData: fetchReportData
  };
};
