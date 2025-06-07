
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BudgetAlert } from '@/components/beranda/BudgetAlert';
import { ShortcutsSection } from '@/components/beranda/ShortcutsSection';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeBeranda } from '@/hooks/useRealtimeBeranda';
import { useCentralizedBudget } from '@/hooks/useCentralizedBudget';
import { useExpenseRecording } from '@/hooks/useExpenseRecording';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Beranda = () => {
  const { user } = useAuth();
  const {
    todoItems,
    importantEvents,
    shoppingList,
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
  const { recordExpense, removeExpense } = useExpenseRecording();

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

  const toggleShoppingItem = async (itemId: string) => {
    const item = shoppingList.find(item => item.id === itemId);
    if (!item) return;
    
    const newPurchasedState = !item.purchased;
    
    try {
      if (newPurchasedState) {
        await recordExpense(item.name, item.price);
        toast.success(`${item.name} ditandai sebagai dibeli`);
      } else {
        await removeExpense(item.name, item.price);
        toast.success(`${item.name} dibatalkan dari pembelian`);
      }

      await Promise.all([refreshBudgetData(), refreshBerandaData()]);
    } catch (error) {
      console.error('Error toggling shopping item:', error);
      toast.error('Gagal mengupdate item belanja');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const totalShoppingPlanned = shoppingList.filter(item => !item.purchased).reduce((total, item) => total + item.price * item.quantity, 0);
  const remainingBudget = Math.max(0, batasHarian - totalSpending);

  if (!user) {
    return (
      <MainLayout title="Beranda">
        <div className="text-center py-8">
          <p className="text-gray-500">Silakan login untuk menggunakan fitur aplikasi</p>
        </div>
      </MainLayout>
    );
  }

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
            disabled={isLoading || budgetLoading}
            className="text-mibu-purple border-mibu-purple"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
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
        {batasHarian > 0 && (
          <Card className="bg-gradient-to-r from-mibu-purple/10 to-mibu-pink/10">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Budget Harian</p>
                  <p className="text-lg font-semibold text-mibu-purple">Rp {formatIDR(batasHarian)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Sisa Budget</p>
                  <p className={`text-lg font-semibold ${remainingBudget > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Rp {formatIDR(remainingBudget)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shopping List */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium text-gray-800">Daftar Belanja</h2>
              <Link to="/belanja" className="text-sm text-mibu-purple hover:underline">
                Kelola →
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-4">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-mibu-purple" />
                <p className="text-sm text-gray-500 mt-2">Memuat...</p>
              </div>
            ) : shoppingList.length > 0 ? (
              <div className="space-y-2">
                {shoppingList.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={item.purchased || false}
                        onCheckedChange={() => toggleShoppingItem(item.id)}
                        className="data-[state=checked]:bg-mibu-purple"
                      />
                      <span className={`${item.purchased ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {item.name}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${item.purchased ? 'line-through text-gray-400' : 'text-mibu-purple'}`}>
                      Rp {formatIDR(item.price)}
                    </span>
                  </div>
                ))}
                
                {totalShoppingPlanned > 0 && (
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Total rencana belanja:</span>
                      <span className="font-medium text-mibu-purple">Rp {formatIDR(totalShoppingPlanned)}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Belum ada daftar belanja</p>
                <Link to="/belanja" className="text-sm text-mibu-purple hover:underline mt-1 inline-block">
                  Tambahkan item →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* To Do List */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium text-gray-800">Tugas Hari Ini</h2>
              <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
                Kelola →
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-4">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-mibu-purple" />
                <p className="text-sm text-gray-500 mt-2">Memuat...</p>
              </div>
            ) : todoItems.length > 0 ? (
              <div className="space-y-2">
                {todoItems.slice(0, 5).map(todo => (
                  <div key={todo.id} className="flex items-center py-2">
                    <Checkbox 
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodoItem(todo.id)}
                      className="mr-3 data-[state=checked]:bg-mibu-purple"
                    />
                    <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {todo.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Tidak ada tugas hari ini</p>
                <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline mt-1 inline-block">
                  Tambahkan tugas →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Events */}
        {importantEvents.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium text-gray-800">Acara Penting</h2>
                <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
                  Lihat Semua →
                </Link>
              </div>
              
              <div className="space-y-2">
                {importantEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="p-3 bg-mibu-lightgray rounded-lg">
                    <div className="font-medium text-gray-800 text-sm">{event.title}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-mibu-purple">{formatDate(event.date)}</span>
                      {event.time && (
                        <span className="text-xs text-gray-500">{event.time}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Beranda;
