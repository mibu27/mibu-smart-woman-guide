
import React from 'react';
import { AlertTriangle, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ShoppingItem {
  id: number;
  name: string;
  price: number;
  purchased?: boolean;
}

interface ShoppingItemListProps {
  items: ShoppingItem[];
  onRemoveItem: (id: number) => void;
  onToggleItem: (id: number) => void;
  onSaveItems: () => void;
  totalSpending: number;
  isOverBudget: boolean;
  formatIDR: (value: number) => string;
  loading: boolean;
}

const ShoppingItemList = ({
  items,
  onRemoveItem,
  onToggleItem,
  onSaveItems,
  totalSpending,
  isOverBudget,
  formatIDR,
  loading
}: ShoppingItemListProps) => {
  return (
    <div className="mt-4">
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={item.purchased || false}
                  onCheckedChange={() => onToggleItem(item.id)}
                  className="data-[state=checked]:bg-mibu-purple data-[state=checked]:border-mibu-purple"
                />
                <span className={item.purchased ? 'line-through text-gray-400' : ''}>
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${item.purchased ? 'line-through text-gray-400' : ''}`}>
                  Rp {formatIDR(item.price)}
                </span>
                <button 
                  onClick={() => onRemoveItem(item.id)} 
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Belum ada item belanja yang ditambahkan
        </div>
      )}
      
      {items.length > 0 && (
        <>
          <div className="border-t pt-3 mt-3 flex justify-between font-medium">
            <span>Total Belanja</span>
            <span className={isOverBudget ? 'text-red-600' : ''}>
              Rp {formatIDR(totalSpending)}
            </span>
          </div>
          
          {isOverBudget && (
            <div className="flex items-center p-2 bg-red-50 text-red-800 rounded-md border border-red-200">
              <AlertTriangle size={20} className="mr-2" />
              <span className="text-sm">Atur rencanamu kembali ! Daftar ini melebihi anggaran tetap harianmu. INI BOROS</span>
            </div>
          )}
          
          {!isOverBudget && totalSpending > 0 && (
            <div className="flex items-center p-2 bg-green-50 text-green-800 rounded-md border border-green-200">
              <span className="text-sm">👏 Bagus! Belanja Anda masih dalam batas harian.</span>
            </div>
          )}
        </>
      )}

      {/* Save button for shopping items */}
      <div className="flex justify-end mt-4">
        <Button 
          onClick={onSaveItems} 
          className="bg-mibu-purple hover:bg-mibu-darkpurple" 
          disabled={loading || items.length === 0}
        >
          <Save size={18} className="mr-2" />
          {loading ? "Menyimpan..." : "Simpan Belanja"}
        </Button>
      </div>
    </div>
  );
};

export default ShoppingItemList;
