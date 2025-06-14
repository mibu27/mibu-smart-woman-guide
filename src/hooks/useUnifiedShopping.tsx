
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from './useErrorHandler';
import { useExpenseRecording } from './useExpenseRecording';
import { ShoppingItem } from '@/types/shared';
import { toast } from "sonner";

export const useUnifiedShopping = () => {
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const { recordExpense, removeExpense } = useExpenseRecording();
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShoppingItems = useCallback(async () => {
    if (!user) {
      setShoppingList([]);
      return;
    }

    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const [shoppingResult, expensesResult] = await Promise.all([
        supabase
          .from('shopping_items')
          .select('id, name, price, quantity')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('expenses')
          .select('description, amount')
          .eq('user_id', user.id)
          .eq('date', today)
          .eq('category', 'belanja')
      ]);

      if (shoppingResult.error) throw shoppingResult.error;
      if (expensesResult.error) throw expensesResult.error;

      // Create purchased items map
      const purchasedItems = new Map();
      if (expensesResult.data) {
        expensesResult.data.forEach(expense => {
          const key = `${expense.description}-${expense.amount}`;
          purchasedItems.set(key, true);
        });
      }

      const items = shoppingResult.data?.map(item => {
        const itemKey = `${item.name}-${item.price}`;
        return {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          purchased: purchasedItems.has(itemKey) || false
        };
      }) || [];

      setShoppingList(items);

    } catch (error) {
      handleError(error as Error, 'Error fetching shopping items');
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError]);

  const toggleShoppingItem = useCallback(async (itemId: string) => {
    const item = shoppingList.find(item => item.id === itemId);
    if (!item) return;
    
    const newPurchasedState = !item.purchased;
    
    // Optimistic update
    setShoppingList(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, purchased: newPurchasedState }
        : item
    ));

    try {
      if (newPurchasedState) {
        await recordExpense(item.name, item.price);
        toast.success(`${item.name} ditandai sebagai dibeli`);
      } else {
        await removeExpense(item.name, item.price);
        toast.success(`${item.name} dibatalkan dari pembelian`);
      }
    } catch (error) {
      // Revert optimistic update on error
      setShoppingList(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, purchased: !newPurchasedState }
          : item
      ));
      handleError(error as Error, 'Error toggling shopping item');
    }
  }, [shoppingList, recordExpense, removeExpense, handleError]);

  const addItem = useCallback((name: string, price: number) => {
    if (!name.trim() || price <= 0) {
      toast.error("Nama item dan harga harus valid");
      return;
    }

    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      price,
      quantity: 1,
      purchased: false
    };
    
    setShoppingList(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  }, []);

  const saveItems = useCallback(async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      setIsLoading(true);

      // Convert to database format
      const dbItems = shoppingList.map(item => ({
        user_id: user.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      // Clear and insert
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
      handleError(error as Error, 'Error saving shopping items');
    } finally {
      setIsLoading(false);
    }
  }, [shoppingList, user, handleError]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const shoppingChannel = supabase
      .channel('shopping-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shopping_items',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Shopping items changed, refreshing');
        fetchShoppingItems();
      })
      .subscribe();

    const expensesChannel = supabase
      .channel('shopping-expenses-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Expenses changed, refreshing shopping');
        fetchShoppingItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(shoppingChannel);
      supabase.removeChannel(expensesChannel);
    };
  }, [user, fetchShoppingItems]);

  useEffect(() => {
    fetchShoppingItems();
  }, [fetchShoppingItems]);

  const totalSpending = shoppingList.reduce((sum, item) => sum + item.price, 0);

  return {
    shoppingList,
    isLoading,
    totalSpending,
    addItem,
    removeItem,
    toggleShoppingItem,
    saveItems,
    refresh: fetchShoppingItems
  };
};
