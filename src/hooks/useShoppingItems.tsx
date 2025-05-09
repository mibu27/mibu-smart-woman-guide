
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShoppingItem {
  id: number;
  name: string;
  price: number;
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
              price: parseFloat(item.price.toString())
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
      price
    };
    setShoppingItems([...shoppingItems, newItemObj]);
  };

  const removeItem = (id: number) => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
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
    saveShoppingItems
  };
};
