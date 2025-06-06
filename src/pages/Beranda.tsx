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
  const {
    user
  } = useAuth();
  const {
    todoItems,
    importantEvents,
    shoppingList,
    isLoading,
    lastUpdated,
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
    recordExpense,
    removeExpense
  } = useExpenseRecording();
  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    await Promise.all([refreshBerandaData(), refreshBudgetData()]);
    toast.success('Data berhasil diperbarui');
  };

  // Toggle todo item dengan optimistic update
  const toggleTodoItem = async (todoId: string) => {
    const todo = todoItems.find(item => item.id === todoId);
    if (!todo) return;
    const newCompletedState = !todo.completed;
    console.log('Toggling todo:', todoId, 'to:', newCompletedState);
    try {
      const {
        error
      } = await supabase.from('tasks').update({
        completed: newCompletedState
      }).eq('id', todoId);
      if (error) throw error;
      toast.success(newCompletedState ? 'Tugas diselesaikan!' : 'Tugas dibatalkan');
      // Data akan otomatis ter-refresh via real-time subscription
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Gagal mengupdate tugas');
    }
  };

  // Toggle shopping item dengan expense recording - FIXED LOGIC
  const toggleShoppingItem = async (itemId: string) => {
    const item = shoppingList.find(item => item.id === itemId);
    if (!item) return;
    const newPurchasedState = !item.purchased;
    console.log('Toggling shopping item:', itemId, 'to:', newPurchasedState);
    try {
      if (newPurchasedState) {
        // Marking as purchased - record expense
        await recordExpense(item.name, item.price);
        toast.success(`${item.name} ditandai sebagai dibeli dan tercatat sebagai pengeluaran`);
      } else {
        // Unmarking as purchased - remove expense
        await removeExpense(item.name, item.price);
        toast.success(`${item.name} dibatalkan dari pembelian dan dihapus dari pengeluaran`);
      }

      // Refresh both budget and beranda data to ensure synchronization
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

  // Calculate shopping totals accurately based on current state
  const totalShoppingPlanned = shoppingList.filter(item => !item.purchased).reduce((total, item) => total + item.price * item.quantity, 0);
  const totalShoppingPurchased = shoppingList.filter(item => item.purchased).reduce((total, item) => total + item.price * item.quantity, 0);

  // Calculate other expenses (total spending minus shopping purchased)
  const otherExpenses = Math.max(0, totalSpending - totalShoppingPurchased);

  // Calculate remaining budget accurately
  const remainingBudget = Math.max(0, batasHarian - totalSpending);

  // Calculate usage percentage
  const usagePercentage = batasHarian > 0 ? Math.round(totalSpending / batasHarian * 100) : 0;

  // Enhanced debug information
  console.log('=== BERANDA SYNCHRONIZED DEBUG ===');
  console.log('Shopping List with Purchase Status:', shoppingList);
  console.log('Total Spending (Centralized):', totalSpending);
  console.log('Shopping Planned (Not Purchased):', totalShoppingPlanned);
  console.log('Shopping Purchased (This List):', totalShoppingPurchased);
  console.log('Other Daily Expenses:', otherExpenses);
  console.log('Daily Budget Limit:', batasHarian);
  console.log('Remaining Budget:', remainingBudget);
  console.log('Synchronization Check:', {
    totalCalculated: totalShoppingPurchased + otherExpenses,
    totalFromBudget: totalSpending,
    isMatching: totalShoppingPurchased + otherExpenses === totalSpending
  });
  console.log('=== END SYNCHRONIZED DEBUG ===');
  if (!user) {
    return <MainLayout title="Beranda">
        <div className="text-center py-8">
          <p className="text-gray-500">Silakan login untuk menggunakan fitur aplikasi</p>
        </div>
      </MainLayout>;
  }
  return <MainLayout title="Beranda">
      <div className="space-y-6">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Jendela Utama - Data Terpusat</h1>
            <p className="text-xs text-gray-500">
              Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading || budgetLoading} className="text-mibu-purple border-mibu-purple">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sinkronisasi Data
          </Button>
        </div>

        {/* Budget Alert */}
        <BudgetAlert isOverBudget={isOverBudget} totalSpending={totalSpending} batasHarian={batasHarian} formatIDR={formatIDR} />

        {/* Shortcuts */}
        <ShortcutsSection />

        {/* Synchronized Data Status */}
        {process.env.NODE_ENV === 'development' && <div className="p-3 bg-green-50 border border-green-200 rounded text-xs">
            <strong>Status Sinkronisasi Data:</strong>
            <br />Total Pengeluaran: Rp {formatIDR(totalSpending)}
            <br />Dari Belanja (Terbeli): Rp {formatIDR(totalShoppingPurchased)}
            <br />Pengeluaran Lain: Rp {formatIDR(otherExpenses)}
            <br />Status: {totalShoppingPurchased + otherExpenses === totalSpending ? '✅ Tersinkronisasi' : '❌ Tidak Tersinkronisasi'}
          </div>}

        {/* Shopping List - Synchronized */}
        <section className="border border-gray-200 rounded-lg p-3 bg-slate-300">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Rencana Belanja Hari Ini (Live Data)</h2>
            <Link to="/belanja" className="text-sm text-mibu-purple hover:underline">
              Kelola di Tab Belanja
            </Link>
          </div>
          
          {/* Accurate Daily Budget Display */}
          {batasHarian > 0}
          
          <Card className="border-2">
            <CardContent className="p-4">
              {isLoading ? <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat daftar belanja...</p>
                </div> : shoppingList.length > 0 ? <div className="space-y-2">
                  {shoppingList.map(item => <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={item.purchased || false} onCheckedChange={() => toggleShoppingItem(item.id)} className="data-[state=checked]:bg-mibu-purple data-[state=checked]:border-mibu-purple" />
                        <span className={`font-medium ${item.purchased ? 'line-through text-gray-400' : ''}`}>
                          {item.name}
                        </span>
                        {item.purchased && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Terbeli & Tercatat
                          </span>}
                      </div>
                      <div className="text-right">
                        <div className={`text-sm text-mibu-purple font-medium ${item.purchased ? 'line-through text-gray-400' : ''}`}>
                          Rp {formatIDR(item.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>)}
                  
                  {/* Accurate Shopping Summary */}
                  <div className="pt-2 mt-2 border-t space-y-1">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total Daftar Belanja:</span>
                      <span className="text-mibu-purple">
                        Rp {formatIDR(totalShoppingPlanned + totalShoppingPurchased)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>• Belum dibeli:</span>
                      <span className="text-orange-600">
                        Rp {formatIDR(totalShoppingPlanned)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>• Sudah dibeli:</span>
                      <span className="text-green-600">
                        Rp {formatIDR(totalShoppingPurchased)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm font-semibold border-t pt-1 mt-2">
                      <span>Sisa Budget Harian:</span>
                      <span className={remainingBudget > 0 ? 'text-green-600' : 'text-red-600'}>
                        Rp {formatIDR(remainingBudget)}
                      </span>
                    </div>
                    
                    {/* Warning if planned shopping exceeds remaining budget */}
                    {totalShoppingPlanned > remainingBudget && <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">
                        ⚠️ Rencana belanja melebihi sisa budget sebesar Rp {formatIDR(totalShoppingPlanned - remainingBudget)}
                      </div>}
                  </div>
                </div> : <div className="text-center py-8 text-gray-500">
                  Belum ada daftar belanja. 
                  <br />
                  <Link to="/belanja" className="text-mibu-purple hover:underline mt-2 inline-block">
                    Tambahkan item belanja
                  </Link>
                </div>}
            </CardContent>
          </Card>
        </section>

        {/* To Do List */}
        <section className="border border-gray-200 rounded-lg p-3 bg-slate-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">To Do List Hari Ini (Live Data)</h2>
            <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
              Kelola di Tab Jadwal
            </Link>
          </div>
          <Card className="border-2">
            <CardContent className="p-4">
              {isLoading ? <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat tugas hari ini...</p>
                </div> : todoItems.length > 0 ? <div className="space-y-2">
                  {todoItems.map(todo => <div key={todo.id} className="flex items-center py-2">
                      <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodoItem(todo.id)} className="mr-3 data-[state=checked]:bg-mibu-purple data-[state=checked]:border-mibu-purple" />
                      <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {todo.title}
                      </span>
                      {todo.completed && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Selesai
                        </span>}
                    </div>)}
                </div> : <div className="text-center py-8 text-gray-500">
                  Tidak ada tugas untuk hari ini.
                  <br />
                  <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                    Tambahkan tugas baru
                  </Link>
                </div>}
            </CardContent>
          </Card>
        </section>

        {/* Important Events */}
        <section className="border border-gray-200 rounded-lg p-3 bg-slate-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Acara Penting (Live Data)</h2>
            <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
              Kelola di Tab Jadwal
            </Link>
          </div>
          <Card className="border-2">
            <CardContent className="p-4">
              {isLoading ? <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat acara penting...</p>
                </div> : importantEvents.length > 0 ? <div className="space-y-3">
                  {importantEvents.map(event => <div key={event.id} className="p-3 bg-mibu-lightgray rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-800">{event.title}</div>
                      {event.description && <div className="text-sm text-gray-600 mt-1">{event.description}</div>}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-mibu-purple">
                          {formatDate(event.date)}
                        </span>
                        {event.time && <span className="text-sm text-gray-500">
                            {event.time}
                          </span>}
                      </div>
                    </div>)}
                </div> : <div className="text-center py-8 text-gray-500">
                  Belum ada acara penting minggu ini.
                  <br />
                  <Link to="/jadwal" className="text-mibu-purple hover:underline mt-2 inline-block">
                    Tambahkan acara baru
                  </Link>
                </div>}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>;
};
export default Beranda;