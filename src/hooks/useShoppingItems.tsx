
import { useShoppingItemsData } from './useShoppingItemsData';
import { useExpenseRecording } from './useExpenseRecording';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  purchased?: boolean;
}

export const useShoppingItems = () => {
  const { shoppingItems, setShoppingItems, loading, setLoading } = useShoppingItemsData();
  const { recordExpense, removeExpense } = useExpenseRecording();

  const addItem = (name: string, price: number) => {
    const newItemObj = {
      id: Date.now().toString(), // Temporary local ID
      name,
      price,
      purchased: false
    };
    setShoppingItems([...shoppingItems, newItemObj]);
  };

  const removeItem = (id: string) => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };

  const toggleItem = async (id: string) => {
    setShoppingItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, purchased: !item.purchased };
        
        // If item is being marked as purchased, record it as an expense
        if (updatedItem.purchased) {
          recordExpense(item.name, item.price);
        } else {
          // If unchecked, remove the expense record
          removeExpense(item.name, item.price);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const saveShoppingItems = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      // Convert local shopping items to database format
      const dbItems = shoppingItems.map(item => ({
        user_id: user.id,
        name: item.name,
        price: item.price,
        quantity: 1 // Default quantity
      }));

      // Clear previous items and insert new ones
      const { error: deleteError } = await supabase
        .from('shopping_items')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      if (dbItems.length > 0) {
        const { error } = await supabase
          .from('shopping_items')
          .insert(dbItems);
          
        if (error) throw error;
      }

      toast.success("Belanja hari ini berhasil disimpan");
    } catch (error) {
      console.error('Error saving shopping items:', error);
      toast.error("Gagal menyimpan belanja");
    } finally {
      setLoading(false);
    }
  };

  const totalSpending = shoppingItems.reduce((sum, item) => sum + item.price, 0);

  return {
    shoppingItems,
    loading,
    totalSpending,
    addItem,
    removeItem,
    toggleItem,
    saveShoppingItems
  };
};
