
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShoppingItem {
  id: number;
  name: string;
  price: number;
  purchased?: boolean;
}

export const useShoppingItems = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch shopping items on component mount
  useEffect(() => {
    const fetchShoppingItems = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch shopping items
          const { data: shoppingData, error: shoppingError } = await supabase
            .from('shopping_items')
            .select('*')
            .eq('user_id', user.id);
          
          if (shoppingError) {
            throw shoppingError;
          }
          
          if (shoppingData && shoppingData.length > 0) {
            const formattedItems = shoppingData.map((item, index) => ({
              id: index + 1,
              name: item.name,
              price: parseFloat(item.price.toString()),
              purchased: false // Default to not purchased
            }));
            setShoppingItems(formattedItems);
          }
        }
      } catch (error) {
        console.error('Error fetching shopping items:', error);
        toast.error("Gagal memuat data belanja");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShoppingItems();
  }, []);

  const addItem = (name: string, price: number) => {
    const newItemObj = {
      id: Date.now(),
      name,
      price,
      purchased: false
    };
    setShoppingItems([...shoppingItems, newItemObj]);
  };

  const removeItem = (id: number) => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };

  const toggleItem = async (id: number) => {
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
