
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBudget = () => {
  const [gajiBulanan, setGajiBulanan] = useState<number>(0);
  const [belanjaWajib, setBelanjaWajib] = useState<number>(0);
  const [batasHarian, setBatasHarian] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Format for displaying IDR - optimized to return whole numbers
  const formatIDR = useCallback((value: number): string => {
    return Math.round(value).toLocaleString('id-ID');
  }, []);

  // Parse IDR formatted string back to number
  const parseIDR = useCallback((value: string): number => {
    return Number(value.replace(/\./g, ''));
  }, []);

  // Optimized fetch function
  const fetchBudgetData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Optimized query - only select needed columns
        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_settings')
          .select('monthly_salary, fixed_expenses')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data
        
        if (budgetError && budgetError.code !== 'PGRST116') {
          throw budgetError;
        }
        
        if (budgetData) {
          setGajiBulanan(budgetData.monthly_salary || 0);
          setBelanjaWajib(budgetData.fixed_expenses || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      toast.error("Gagal memuat data anggaran");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  // Calculate daily spending limit - optimized with rounding
  useEffect(() => {
    if (gajiBulanan > 0) {
      const currentDate = new Date();
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const dailyLimit = (gajiBulanan - belanjaWajib) / daysInMonth;
      setBatasHarian(Math.max(0, Math.round(dailyLimit))); // Round to whole number
    }
  }, [gajiBulanan, belanjaWajib]);

  return { 
    gajiBulanan, 
    belanjaWajib, 
    batasHarian, 
    loading, 
    formatIDR, 
    parseIDR,
    refreshBudgetData: fetchBudgetData
  };
};
