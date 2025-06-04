
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const formatIDR = (value: number): string => {
    return Math.round(value).toLocaleString('id-ID');
  };

  const fetchBudgetData = async () => {
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

      // Fetch budget settings and today's expenses in parallel
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

      let gajiBulanan = 0;
      let belanjaWajib = 0;
      let batasHarian = 0;
      let totalSpending = 0;

      // Process budget settings
      if (!budgetResult.error && budgetResult.data) {
        gajiBulanan = Number(budgetResult.data.monthly_salary) || 0;
        belanjaWajib = Number(budgetResult.data.fixed_expenses) || 0;
        
        // Calculate daily budget limit
        const currentDate = new Date();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const dailyLimit = (gajiBulanan - belanjaWajib) / daysInMonth;
        batasHarian = Math.max(0, Math.round(dailyLimit));
      }

      // Process today's expenses
      if (!expensesResult.error && expensesResult.data) {
        totalSpending = expensesResult.data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      }

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
      console.error('Error fetching budget data:', error);
      toast.error("Gagal memuat data anggaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  return {
    ...budgetData,
    loading,
    formatIDR,
    refreshBudgetData: fetchBudgetData
  };
};
