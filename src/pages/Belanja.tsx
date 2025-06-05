
import React, { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { useBudget } from '@/hooks/useBudget';
import { useShoppingItems } from '@/hooks/useShoppingItems';
import BudgetSummary from '@/components/belanja/BudgetSummary';
import BudgetAlert from '@/components/belanja/BudgetAlert';
import ShoppingItemForm from '@/components/belanja/ShoppingItemForm';
import ShoppingItemList from '@/components/belanja/ShoppingItemList';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Link } from 'react-router-dom';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Belanja = () => {
  console.log('Belanja page rendering');
  
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
    saveShoppingItems,
    refreshShoppingItems
  } = useShoppingItems();

  // Refresh budget data when component mounts to ensure latest data
  useEffect(() => {
    console.log('Belanja: refreshing budget data on mount');
    refreshBudgetData();
  }, [refreshBudgetData]);

  // Calculate budget percentage used
  const budgetPercentageUsed = batasHarian > 0 ? Math.min(totalSpending / batasHarian * 100, 100) : 0;

  // Check if over budget
  const isOverBudget = batasHarian > 0 && totalSpending > batasHarian;
  const hasGaji = gajiBulanan > 0;

  console.log('Belanja state:', { 
    hasGaji, 
    isOverBudget, 
    totalSpending, 
    batasHarian, 
    shoppingItemsCount: shoppingItems.length,
    loading 
  });

  const handleRefreshAll = () => {
    console.log('Refreshing all data');
    refreshBudgetData();
    refreshShoppingItems();
  };

  return (
    <MainLayout title="Belanja">
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Refresh Button */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshAll}
              disabled={loading}
              className="text-mibu-purple border-mibu-purple"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>

          {/* Budget Alert */}
          {isOverBudget && (
            <ErrorBoundary fallback={<div className="text-red-500">Error loading budget alert</div>}>
              <BudgetAlert 
                isOverBudget={isOverBudget} 
                totalSpending={totalSpending} 
                batasHarian={batasHarian} 
                formatIDR={formatIDR} 
              />
            </ErrorBoundary>
          )}
          
          {/* Budget Summary */}
          <ErrorBoundary fallback={<div className="text-red-500">Error loading budget summary</div>}>
            <BudgetSummary 
              gajiBulanan={gajiBulanan} 
              belanjaWajib={belanjaWajib} 
              batasHarian={batasHarian} 
              budgetPercentageUsed={budgetPercentageUsed} 
              formatIDR={formatIDR} 
            />
          </ErrorBoundary>
          
          {/* Shopping List */}
          <section className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-3">Rencana Belanja Hari Ini</h2>
            <Card className="border-2">
              <CardContent className="p-4 space-y-4">
                <ErrorBoundary fallback={<div className="text-red-500">Error loading shopping section</div>}>
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
                      <ErrorBoundary fallback={<div className="text-red-500">Error loading form</div>}>
                        <ShoppingItemForm onAddItem={addItem} />
                      </ErrorBoundary>
                      
                      {/* Shopping list */}
                      <ErrorBoundary fallback={<div className="text-red-500">Error loading shopping list</div>}>
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
                      </ErrorBoundary>
                    </>
                  )}
                </ErrorBoundary>
              </CardContent>
            </Card>
          </section>
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
};

export default Belanja;
