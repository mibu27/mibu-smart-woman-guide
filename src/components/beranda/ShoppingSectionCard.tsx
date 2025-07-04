
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
  totalSpending?: number;
}

export const ShoppingSectionCard = ({
  shoppingList,
  isLoading,
  toggleShoppingItem,
  formatIDR,
  totalSpending = 0
}: ShoppingSectionCardProps) => {
  console.log('ShoppingSectionCard data:', {
    shoppingListCount: shoppingList.length,
    totalSpending,
    shoppingItems: shoppingList.map(item => ({
      name: item.name,
      price: item.price,
      purchased: item.purchased
    }))
  });

  // Hitung total dari shopping list yang sudah dibeli (tercentang)
  const totalFromShoppingList = shoppingList
    .filter(item => item.purchased)
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  // Hitung total rencana belanja (yang belum dibeli)
  const totalShoppingPlanned = shoppingList
    .filter(item => !item.purchased)
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  // Hitung pengeluaran lainnya (total pengeluaran - dari shopping list)
  const otherExpenses = Math.max(0, totalSpending - totalFromShoppingList);

  console.log('ShoppingSectionCard calculations:', {
    totalFromShoppingList,
    totalShoppingPlanned,
    otherExpenses,
    totalSpending
  });

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
                    {item.name} ({item.quantity}x)
                  </span>
                </div>
                <span className={`text-sm font-medium ${item.purchased ? 'line-through text-gray-400' : 'text-mibu-purple'}`}>
                  Rp {formatIDR(item.price * item.quantity)}
                </span>
              </div>
            ))}
            
            <div className="border-t pt-3 mt-3 space-y-2">
              {totalFromShoppingList > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Belanja dari daftar:</span>
                  <span className="font-medium text-green-600">Rp {formatIDR(totalFromShoppingList)}</span>
                </div>
              )}
              {otherExpenses > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pengeluaran lainnya:</span>
                  <span className="font-medium text-orange-600">Rp {formatIDR(otherExpenses)}</span>
                </div>
              )}
              {totalSpending > 0 && (
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span className="text-gray-800">Total pengeluaran hari ini:</span>
                  <span className="text-red-600">Rp {formatIDR(totalSpending)}</span>
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
