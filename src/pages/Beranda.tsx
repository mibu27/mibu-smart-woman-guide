
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BudgetAlert } from '@/components/beranda/BudgetAlert';
import { ShortcutsSection } from '@/components/beranda/ShortcutsSection';
import { BudgetSummarySection } from '@/components/beranda/BudgetSummarySection';
import { ShoppingSectionCard } from '@/components/beranda/ShoppingSectionCard';
import { TodoSectionCard } from '@/components/beranda/TodoSectionCard';
import { EventsSectionCard } from '@/components/beranda/EventsSectionCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeBeranda } from '@/hooks/useRealtimeBeranda';
import { useCentralizedBudget } from '@/hooks/useCentralizedBudget';
import { useUnifiedShopping } from '@/hooks/useUnifiedShopping';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Beranda = () => {
  const { user } = useAuth();
  const {
    todoItems,
    importantEvents,
    isLoading,
    refresh: refreshBerandaData
  } = useRealtimeBeranda();
  
  const {
    batasHarian,
    totalSpending,
    isOverBudget,
    formatIDR,
    refreshBudgetData,
    loading: budgetLoading
  } = useCentralizedBudget();

  const { 
    shoppingList, 
    toggleShoppingItem,
    isLoading: shoppingLoading 
  } = useUnifiedShopping();

  const handleRefresh = async () => {
    await Promise.all([refreshBerandaData(), refreshBudgetData()]);
    toast.success('Data berhasil diperbarui');
  };

  const toggleTodoItem = async (todoId: string) => {
    const todo = todoItems.find(item => item.id === todoId);
    if (!todo) return;
    
    const newCompletedState = !todo.completed;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompletedState })
        .eq('id', todoId);
      
      if (error) throw error;
      toast.success(newCompletedState ? 'Tugas diselesaikan!' : 'Tugas dibatalkan');
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Gagal mengupdate tugas');
    }
  };

  const handleToggleShoppingItem = async (itemId: string) => {
    try {
      await toggleShoppingItem(itemId);
      await refreshBudgetData();
      toast.success('Item belanja berhasil diupdate');
    } catch (error) {
      console.error('Error toggling shopping item in beranda:', error);
      toast.error('Gagal mengupdate item belanja');
    }
  };

  if (!user) {
    return (
      <MainLayout title="Beranda">
        <div className="text-center py-8">
          <p className="text-gray-500">Silakan login untuk menggunakan fitur aplikasi</p>
        </div>
      </MainLayout>
    );
  }

  const totalLoading = isLoading || budgetLoading || shoppingLoading;

  return (
    <MainLayout title="Beranda">
      <div className="space-y-4">
        {/* Header with refresh */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard Harian</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={totalLoading}
            className="text-mibu-purple border-mibu-purple"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${totalLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Budget Alert */}
        <BudgetAlert 
          isOverBudget={isOverBudget} 
          totalSpending={totalSpending} 
          batasHarian={batasHarian} 
          formatIDR={formatIDR} 
        />

        {/* Shortcuts */}
        <ShortcutsSection />

        {/* Budget Summary */}
        <BudgetSummarySection 
          batasHarian={batasHarian}
          totalSpending={totalSpending}
          formatIDR={formatIDR}
        />

        {/* Shopping List */}
        <ShoppingSectionCard 
          shoppingList={shoppingList}
          isLoading={shoppingLoading}
          toggleShoppingItem={handleToggleShoppingItem}
          formatIDR={formatIDR}
        />

        {/* To Do List */}
        <TodoSectionCard 
          todoItems={todoItems}
          isLoading={isLoading}
          toggleTodoItem={toggleTodoItem}
        />

        {/* Important Events */}
        <EventsSectionCard importantEvents={importantEvents} />
      </div>
    </MainLayout>
  );
};

export default Beranda;
