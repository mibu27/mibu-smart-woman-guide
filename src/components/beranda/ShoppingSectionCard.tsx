
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from 'lucide-react';

interface ShoppingSectionCardProps {
  shoppingList: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    purchased?: boolean;
  }>;
  isLoading: boolean;
  toggleShoppingItem: (itemId: string) => void;
  formatIDR: (value: number) => string;
  totalSpending?: number; // Add this to use actual total spending
}

export const ShoppingSectionCard = ({
  shoppingList,
  isLoading,
  toggleShoppingItem,
  formatIDR,
  totalSpending = 0
}: ShoppingSectionCardProps) => {
  const totalShoppingPlanned = shoppingList
    .filter(item => !item.purchased)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  // Use the actual total spending from budget calculation instead of just purchased shopping items
  const totalShoppingPurchased = totalSpending;

  const handleToggleItem = async (itemId: string) => {
    try {
      await toggleShoppingItem(itemId);
    } catch (error) {
      console.error('Error toggling shopping item in beranda:', error);
    }
  };

  return (
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
                    onCheckedChange={() => handleToggleItem(item.id)}
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
            
            <div className="border-t pt-2 mt-2 space-y-1">
              {totalShoppingPurchased > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total belanja hari ini:</span>
                  <span className="font-medium text-red-600">Rp {formatIDR(totalShoppingPurchased)}</span>
                </div>
              )}
              {totalShoppingPlanned > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rencana belanja:</span>
                  <span className="font-medium text-mibu-purple">Rp {formatIDR(totalShoppingPlanned)}</span>
                </div>
              )}
            </div>
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
  );
};
