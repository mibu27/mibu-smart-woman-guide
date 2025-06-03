
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

  return {
    shoppingItems,
    setShoppingItems,
    loading,
    setLoading
  };
};
