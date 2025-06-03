
import React, { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { useBudget } from '@/hooks/useBudget';
import { useShoppingItems } from '@/hooks/useShoppingItems';
import BudgetSummary from '@/components/belanja/BudgetSummary';
import BudgetAlert from '@/components/belanja/BudgetAlert';
import ShoppingItemForm from '@/components/belanja/ShoppingItemForm';
import ShoppingItemList from '@/components/belanja/ShoppingItemList';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Belanja = () => {
  // Use our custom hooks
  const {
    gajiBulanan,
    belanjaWajib,
    batasHarian,
    formatIDR,
    refreshBudgetData
  } = useBudget();

  const {
    shoppingItems,
    loading,
    totalSpending,
    addItem,
    removeItem,
    toggleItem,
    saveShoppingItems
  } = useShoppingItems();

  // Refresh budget data when component mounts to ensure latest data
  useEffect(() => {
    refreshBudgetData();
  }, [refreshBudgetData]);

  // Calculate budget percentage used
  const budgetPercentageUsed = batasHarian > 0 ? Math.min(totalSpending / batasHarian * 100, 100) : 0;

  // Check if over budget
  const isOverBudget = batasHarian > 0 && totalSpending > batasHarian;
  const hasGaji = gajiBulanan > 0;

  return (
    <MainLayout title="Belanja">
      <div className="space-y-6">
        {/* Budget Alert */}
        {isOverBudget && (
          <BudgetAlert 
            isOverBudget={isOverBudget} 
            totalSpending={totalSpending} 
            batasHarian={batasHarian} 
            formatIDR={formatIDR} 
          />
        )}
        
        {/* Budget Summary */}
        <BudgetSummary 
          gajiBulanan={gajiBulanan} 
          belanjaWajib={belanjaWajib} 
          batasHarian={batasHarian} 
          budgetPercentageUsed={budgetPercentageUsed} 
          formatIDR={formatIDR} 
        />
        
        {/* Shopping List */}
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">Rencana Belanja Hari Ini</h2>
          <Card className="border-2">
            <CardContent className="p-4 space-y-4">
              {!hasGaji ? (
                <div className="p-6 text-center">
                  <ShoppingCart size={32} className="mx-auto mb-3 text-orange-500" />
                  <p className="mb-2 text-gray-700">Pengaturan gaji belum dilakukan</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Isi informasi gaji terlebih dahulu untuk mulai mengelola belanja
                  </p>
                  <Link to="/belanja/gaji" className="text-mibu-purple hover:underline">
                    Atur Gaji Sekarang
                  </Link>
                </div>
              ) : (
                <>
                  {/* Form to add items */}
                  <ShoppingItemForm onAddItem={addItem} />
                  
                  {/* Shopping list */}
                  <ShoppingItemList 
                    items={shoppingItems} 
                    onRemoveItem={removeItem} 
                    onToggleItem={toggleItem}
                    onSaveItems={saveShoppingItems} 
                    totalSpending={totalSpending} 
                    isOverBudget={isOverBudget} 
                    formatIDR={formatIDR} 
                    loading={loading} 
                  />
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Belanja;
