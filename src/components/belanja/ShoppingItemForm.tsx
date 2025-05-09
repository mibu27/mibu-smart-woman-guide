
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShoppingItemFormProps {
  onAddItem: (name: string, price: number) => void;
}

const ShoppingItemForm = ({ onAddItem }: ShoppingItemFormProps) => {
  const [newItem, setNewItem] = useState({
    name: "",
    price: ""
  });
  
  // Handle change for price input with IDR formatting
  const handlePriceChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '') {
      setNewItem({
        ...newItem,
        price: ''
      });
      return;
    }

    // Format as IDR
    const formattedValue = parseInt(numericValue, 10).toLocaleString('id-ID');
    setNewItem({
      ...newItem,
      price: formattedValue
    });
  };
  
  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Mohon isi nama dan harga barang");
      return;
    }
    
    const price = parseFloat(newItem.price.replace(/\./g, '').replace(/,/g, '.'));
    if (isNaN(price) || price <= 0) {
      toast.error("Harga harus berupa angka positif");
      return;
    }
    
    onAddItem(newItem.name, price);
    setNewItem({
      name: "",
      price: ""
    });
  };
  
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Label htmlFor="item-name">Nama Barang</Label>
        <Input 
          id="item-name" 
          value={newItem.name} 
          onChange={e => setNewItem({...newItem, name: e.target.value})} 
          placeholder="Nama barang" 
          className="mt-1" 
        />
      </div>
      <div className="w-1/3">
        <Label htmlFor="item-price">Harga (Rp)</Label>
        <Input 
          id="item-price" 
          value={newItem.price} 
          onChange={e => handlePriceChange(e.target.value)} 
          placeholder="Harga" 
          className="mt-1" 
        />
      </div>
      <div className="flex items-end">
        <Button 
          onClick={handleAddItem} 
          className="mt-1 bg-mibu-purple hover:bg-mibu-darkpurple"
        >
          Tambah
        </Button>
      </div>
    </div>
  );
};

export default ShoppingItemForm;
