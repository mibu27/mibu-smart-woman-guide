
import { useShoppingItemsData } from './useShoppingItemsData';
import { useShoppingItemsManagement } from './useShoppingItemsManagement';
import { useEffect } from 'react';

export const useShoppingItems = () => {
  const { shoppingItems, loading: dataLoading, refreshShoppingItems } = useShoppingItemsData();
  const {
    items,
    setItems,
    loading: managementLoading,
    totalSpending,
    addItem,
    removeItem,
    toggleItem,
    saveItems
  } = useShoppingItemsManagement();

  // Sync data with management state
  useEffect(() => {
    if (shoppingItems.length > 0) {
      setItems(shoppingItems);
    }
  }, [shoppingItems, setItems]);

  const loading = dataLoading || managementLoading;

  return {
    shoppingItems: items,
    loading,
    totalSpending,
    addItem,
    removeItem,
    toggleItem,
    saveShoppingItems: saveItems,
    refreshShoppingItems
  };
};
