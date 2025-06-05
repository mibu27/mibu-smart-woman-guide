
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorHandler } from './useErrorHandler';

export const useExpenseRecording = () => {
  const { handleError } = useErrorHandler();

  const recordExpense = useCallback(async (itemName: string, amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      if (!itemName.trim() || amount <= 0) {
        toast.error("Nama item dan jumlah harus valid");
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: amount,
          description: itemName.trim(),
          category: 'belanja',
          date: today
        });

      if (error) throw error;
      
      toast.success(`${itemName} tercatat sebagai pengeluaran hari ini`);
    } catch (error) {
      handleError(error as Error, 'Error recording expense');
      throw error; // Re-throw for optimistic update rollback
    }
  }, [handleError]);

  const removeExpense = useCallback(async (itemName: string, amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', user.id)
        .eq('description', itemName.trim())
        .eq('amount', amount)
        .eq('date', today)
        .eq('category', 'belanja');

      if (error) throw error;
      
      toast.success(`${itemName} dihapus dari pengeluaran hari ini`);
    } catch (error) {
      handleError(error as Error, 'Error removing expense');
      throw error; // Re-throw for optimistic update rollback
    }
  }, [handleError]);

  return {
    recordExpense,
    removeExpense
  };
};
