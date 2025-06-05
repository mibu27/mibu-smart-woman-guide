
import React, { memo, useCallback } from 'react';
import { AlertTriangle, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  purchased?: boolean;
}

interface ShoppingItemListProps {
  items: ShoppingItem[];
  onRemoveItem: (id: string) => void;
  onToggleItem: (id: string) => void;
  onSaveItems: () => void;
  totalSpending: number;
  isOverBudget: boolean;
  formatIDR: (value: number) => string;
  loading: boolean;
}

const ShoppingItemRow = memo(({ 
  item, 
  onRemove, 
  onToggle, 
  formatIDR 
}: {
  item: ShoppingItem;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  formatIDR: (value: number) => string;
}) => {
  const handleToggle = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);

  return (
    <li className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={item.purchased || false}
          onCheckedChange={handleToggle}
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
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 text-sm transition-colors"
        >
          Hapus
        </button>
      </div>
    </li>
  );
});

ShoppingItemRow.displayName = 'ShoppingItemRow';

const ShoppingItemList = memo(({
  items,
  onRemoveItem,
  onToggleItem,
  onSaveItems,
  totalSpending,
  isOverBudget,
  formatIDR,
  loading
}: ShoppingItemListProps) => {
  const handleSave = useCallback(() => {
    onSaveItems();
  }, [onSaveItems]);

  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Belum ada item belanja yang ditambahkan
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ul className="space-y-2">
        {items.map(item => (
          <ShoppingItemRow
            key={item.id}
            item={item}
            onRemove={onRemoveItem}
            onToggle={onToggleItem}
            formatIDR={formatIDR}
          />
        ))}
      </ul>
      
      <div className="border-t pt-3 mt-3 flex justify-between font-medium">
        <span>Total Belanja</span>
        <span className={isOverBudget ? 'text-red-600' : ''}>
          Rp {formatIDR(totalSpending)}
        </span>
      </div>
      
      {isOverBudget && (
        <div className="flex items-center p-2 bg-red-50 text-red-800 rounded-md border border-red-200 mt-2">
          <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
          <span className="text-sm">
            Atur rencanamu kembali! Daftar ini melebihi anggaran tetap harianmu. INI BOROS
          </span>
        </div>
      )}
      
      {!isOverBudget && totalSpending > 0 && (
        <div className="flex items-center p-2 bg-green-50 text-green-800 rounded-md border border-green-200 mt-2">
          <span className="text-sm">👏 Bagus! Belanja Anda masih dalam batas harian.</span>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleSave}
          className="bg-mibu-purple hover:bg-mibu-darkpurple transition-colors" 
          disabled={loading}
        >
          <Save size={18} className="mr-2" />
          {loading ? "Menyimpan..." : "Simpan Belanja"}
        </Button>
      </div>
    </div>
  );
});

ShoppingItemList.displayName = 'ShoppingItemList';

export default ShoppingItemList;
