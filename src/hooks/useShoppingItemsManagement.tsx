
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useExpenseRecording } from './useExpenseRecording';
import { useErrorHandler } from './useErrorHandler';

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
  const { handleError } = useErrorHandler();

  const addItem = useCallback((name: string, price: number) => {
    if (!name.trim() || price <= 0) {
      toast.error("Nama item dan harga harus valid");
      return;
    }

    const newItem: ShoppingItem = {
      id: crypto.randomUUID(), // Use proper UUID
      name: name.trim(),
      price,
      purchased: false
    };
    
    setItems(prev => [...prev, newItem]);
    console.log('Added item:', newItem);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const filteredItems = prev.filter(item => item.id !== id);
      console.log('Removed item with id:', id);
      return filteredItems;
    });
  }, []);

  const toggleItem = useCallback(async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) {
      toast.error("Item tidak ditemukan");
      return;
    }

    const newPurchasedState = !item.purchased;
    console.log('Toggling item:', id, 'to:', newPurchasedState);
    
    // Optimistic update
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, purchased: newPurchasedState }
        : item
    ));

    try {
      if (newPurchasedState) {
        await recordExpense(item.name, item.price);
        console.log('Expense recorded for:', item.name);
      } else {
        await removeExpense(item.name, item.price);
        console.log('Expense removed for:', item.name);
      }
    } catch (error) {
      // Revert optimistic update on error
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, purchased: !newPurchasedState }
          : item
      ));
      handleError(error as Error, 'Error toggling item');
    }
  }, [items, recordExpense, removeExpense, handleError]);

  const saveItems = useCallback(async () => {
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

      console.log('Shopping items saved successfully');
      toast.success("Daftar belanja berhasil disimpan");
    } catch (error) {
      handleError(error as Error, 'Error saving shopping items');
    } finally {
      setLoading(false);
    }
  }, [items, handleError]);

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
