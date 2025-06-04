
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShoppingItem {
  id: number;
  name: string;
  price: number;
  purchased?: boolean;
}

export const useShoppingItemsData = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Optimized fetch function with better error handling
  const fetchShoppingItems = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Optimized query - only select needed columns
        const { data: shoppingData, error: shoppingError } = await supabase
          .from('shopping_items')
          .select('id, name, price, quantity')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
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
        } else {
          setShoppingItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching shopping items:', error);
      toast.error("Gagal memuat data belanja");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingItems();
  }, []);

  return {
    shoppingItems,
    setShoppingItems,
    loading,
    setLoading,
    refreshShoppingItems: fetchShoppingItems
  };
};
