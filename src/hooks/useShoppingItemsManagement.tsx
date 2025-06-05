
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useExpenseRecording } from './useExpenseRecording';

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  purchased?: boolean;
}

export const useShoppingItemsManagement = (
  initialItems: ShoppingItem[] = []
) => {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const { recordExpense, removeExpense } = useExpenseRecording();

  const addItem = (name: string, price: number) => {
    if (!name.trim() || price <= 0) {
      toast.error("Nama item dan harga harus valid");
      return;
    }

    const newItem: ShoppingItem = {
      id: `temp_${Date.now()}`,
      name: name.trim(),
      price,
      purchased: false
    };
    
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItem = async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) {
      toast.error("Item tidak ditemukan");
      return;
    }

    const newPurchasedState = !item.purchased;
    
    // Optimistic update
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, purchased: newPurchasedState }
        : item
    ));

    try {
      if (newPurchasedState) {
        await recordExpense(item.name, item.price);
      } else {
        await removeExpense(item.name, item.price);
      }
    } catch (error) {
      // Revert optimistic update on error
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, purchased: !newPurchasedState }
          : item
      ));
      console.error('Error toggling item:', error);
      toast.error("Gagal mengubah status item");
    }
  };

  const saveItems = async () => {
    if (items.length === 0) {
      toast.warning("Tidak ada item untuk disimpan");
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      // Convert to database format
      const dbItems = items.map(item => ({
        user_id: user.id,
        name: item.name,
        price: item.price,
        quantity: 1
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

      toast.success("Daftar belanja berhasil disimpan");
    } catch (error) {
      console.error('Error saving shopping items:', error);
      toast.error("Gagal menyimpan daftar belanja");
    } finally {
      setLoading(false);
    }
  };

  const totalSpending = items.reduce((sum, item) => sum + item.price, 0);

  return {
    items,
    setItems,
    loading,
    totalSpending,
    addItem,
    removeItem,
    toggleItem,
    saveItems
  };
};
