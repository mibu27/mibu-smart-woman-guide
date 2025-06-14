
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorHandler } from './useErrorHandler';

interface BudgetData {
  gajiBulanan: number;
  belanjaWajib: number;
  batasHarian: number;
  totalSpending: number;
  budgetPercentageUsed: number;
  isOverBudget: boolean;
}

export const useCentralizedBudget = () => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    gajiBulanan: 0,
    belanjaWajib: 0,
    batasHarian: 0,
    totalSpending: 0,
    budgetPercentageUsed: 0,
    isOverBudget: false
  });
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const formatIDR = useCallback((value: number): string => {
    return Math.round(value).toLocaleString('id-ID');
  }, []);

  const fetchBudgetData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBudgetData({
          gajiBulanan: 0,
          belanjaWajib: 0,
          batasHarian: 0,
          totalSpending: 0,
          budgetPercentageUsed: 0,
          isOverBudget: false
        });
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      // Parallel queries for better performance
      const [budgetResult, expensesResult] = await Promise.all([
        supabase
          .from('budget_settings')
          .select('monthly_salary, fixed_expenses')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', user.id)
          .eq('date', today)
      ]);

      if (budgetResult.error && budgetResult.error.code !== 'PGRST116') {
        throw budgetResult.error;
      }

      if (expensesResult.error) {
        throw expensesResult.error;
      }

      let gajiBulanan = 0;
      let belanjaWajib = 0;
      let batasHarian = 0;
      let totalSpending = 0;

      // Process budget settings
      if (budgetResult.data) {
        gajiBulanan = Number(budgetResult.data.monthly_salary) || 0;
        belanjaWajib = Number(budgetResult.data.fixed_expenses) || 0;
        
        // Calculate daily budget limit
        const currentDate = new Date();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const dailyLimit = (gajiBulanan - belanjaWajib) / daysInMonth;
        batasHarian = Math.max(0, Math.round(dailyLimit));
      }

      // Process expenses - sum all expenses for today
      if (expensesResult.data && expensesResult.data.length > 0) {
        totalSpending = expensesResult.data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      }

      console.log('Budget calculation:', {
        gajiBulanan,
        belanjaWajib, 
        batasHarian,
        totalSpending,
        expensesCount: expensesResult.data?.length || 0
      });

      // Calculate derived values
      const budgetPercentageUsed = batasHarian > 0 ? Math.min(totalSpending / batasHarian * 100, 100) : 0;
      const isOverBudget = batasHarian > 0 && totalSpending > batasHarian;

      setBudgetData({
        gajiBulanan,
        belanjaWajib,
        batasHarian,
        totalSpending,
        budgetPercentageUsed,
        isOverBudget
      });

    } catch (error) {
      handleError(error as Error, 'Error fetching budget data');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Memoized values for performance
  const memoizedBudgetData = useMemo(() => budgetData, [budgetData]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  // Real-time subscription for expenses changes
  useEffect(() => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const expensesChannel = supabase
      .channel('budget-expenses-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Expenses changed, refreshing budget');
        fetchBudgetData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(expensesChannel);
    };
  }, [fetchBudgetData]);

  return {
    ...memoizedBudgetData,
    loading,
    formatIDR,
    refreshBudgetData: fetchBudgetData
  };
};
