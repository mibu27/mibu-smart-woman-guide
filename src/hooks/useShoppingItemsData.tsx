
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorHandler } from './useErrorHandler';

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  purchased?: boolean;
}

export const useShoppingItemsData = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const fetchShoppingItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setShoppingItems([]);
        return;
      }

      const { data: shoppingData, error } = await supabase
        .from('shopping_items')
        .select('id, name, price, quantity')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (shoppingData && shoppingData.length > 0) {
        const formattedItems = shoppingData.map((item) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price.toString()),
          purchased: false
        }));
        setShoppingItems(formattedItems);
      } else {
        setShoppingItems([]);
      }
    } catch (error) {
      handleError(error as Error, 'Error fetching shopping items');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchShoppingItems();
  }, [fetchShoppingItems]);

  return {
    shoppingItems,
    setShoppingItems,
    loading,
    refreshShoppingItems: fetchShoppingItems
  };
};
