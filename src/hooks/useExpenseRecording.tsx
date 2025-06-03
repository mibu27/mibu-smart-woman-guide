
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useExpenseRecording = () => {
  const recordExpense = async (itemName: string, amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Record this as an expense in the expenses table
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: amount,
          description: itemName,
          category: 'belanja',
          date: today
        });

      if (error) {
        console.error('Error recording expense:', error);
        toast.error("Gagal mencatat pengeluaran");
        return;
      }
      
      toast.success(`${itemName} tercatat sebagai pengeluaran hari ini`);
    } catch (error) {
      console.error('Error recording expense:', error);
      toast.error("Gagal mencatat pengeluaran");
    }
  };

  const removeExpense = async (itemName: string, amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Remove the expense record from the expenses table
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', user.id)
        .eq('description', itemName)
        .eq('amount', amount)
        .eq('date', today)
        .eq('category', 'belanja');

      if (error) {
        console.error('Error removing expense:', error);
        toast.error("Gagal menghapus pengeluaran");
        return;
      }
      
      toast.success(`${itemName} dihapus dari pengeluaran hari ini`);
    } catch (error) {
      console.error('Error removing expense:', error);
      toast.error("Gagal menghapus pengeluaran");
    }
  };

  return {
    recordExpense,
    removeExpense
  };
};
