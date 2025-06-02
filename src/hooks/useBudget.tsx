
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBudget = () => {
  const [gajiBulanan, setGajiBulanan] = useState<number>(0);
  const [belanjaWajib, setBelanjaWajib] = useState<number>(0);
  const [batasHarian, setBatasHarian] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Format for displaying IDR
  const formatIDR = (value: number): string => {
    return value.toLocaleString('id-ID');
  };

  // Parse IDR formatted string back to number
  const parseIDR = (value: string): number => {
    return Number(value.replace(/\./g, ''));
  };

  // Fetch user's budget settings on component mount
  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch budget settings
        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (budgetError && budgetError.code !== 'PGRST116') {
          // PGRST116 means no rows returned
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
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  // Calculate daily spending limit
  useEffect(() => {
    if (gajiBulanan > 0) {
      const currentDate = new Date();
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const dailyLimit = (gajiBulanan - belanjaWajib) / daysInMonth;
      setBatasHarian(Math.max(0, dailyLimit));
    }
  }, [gajiBulanan, belanjaWajib]);

  // Add refresh function to be called when data changes
  const refreshBudgetData = () => {
    fetchBudgetData();
  };

  return { 
    gajiBulanan, 
    belanjaWajib, 
    batasHarian, 
    loading, 
    formatIDR, 
    parseIDR,
    refreshBudgetData
  };
};
