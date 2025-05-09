
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { useBudget } from '@/hooks/useBudget';
import { useShoppingItems } from '@/hooks/useShoppingItems';
import BudgetSummary from '@/components/belanja/BudgetSummary';
import BudgetAlert from '@/components/belanja/BudgetAlert';
import ShoppingItemForm from '@/components/belanja/ShoppingItemForm';
import ShoppingItemList from '@/components/belanja/ShoppingItemList';

const Belanja = () => {
  // Use our custom hooks
  const { 
    gajiBulanan, 
    belanjaWajib, 
    batasHarian, 
    formatIDR 
  } = useBudget();
  
  const { 
    shoppingItems, 
    loading, 
    totalSpending, 
    addItem, 
    removeItem, 
    saveShoppingItems 
  } = useShoppingItems();

  // Calculate budget percentage used
  const budgetPercentageUsed = batasHarian > 0 ? Math.min(totalSpending / batasHarian * 100, 100) : 0;
  
  // Check if over budget
  const isOverBudget = batasHarian > 0 && totalSpending > batasHarian;

  return (
    <MainLayout title="Belanja">
      <div className="space-y-6">
        {/* Budget Alert */}
        <BudgetAlert 
          isOverBudget={isOverBudget}
          totalSpending={totalSpending}
          batasHarian={batasHarian}
          formatIDR={formatIDR}
        />
        
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
          <h2 className="text-lg font-medium mb-3">Set Belanja Hari Ini</h2>
          <Card className="border-2">
            <CardContent className="p-4 space-y-4">
              {/* Form to add items */}
              <ShoppingItemForm onAddItem={addItem} />
              
              {/* Shopping list */}
              <ShoppingItemList 
                items={shoppingItems}
                onRemoveItem={removeItem}
                onSaveItems={saveShoppingItems}
                totalSpending={totalSpending}
                isOverBudget={isOverBudget}
                formatIDR={formatIDR}
                loading={loading}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Belanja;
