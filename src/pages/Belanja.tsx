
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, AlertTriangle, BadgeDollarSign, Save } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Belanja = () => {
  const [gajiBulanan, setGajiBulanan] = useState<number>(0);
  const [belanjaWajib, setBelanjaWajib] = useState<number>(0);
  const [batasHarian, setBatasHarian] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
  // Format for displaying IDR
  const formatIDR = (value: number): string => {
    return value.toLocaleString('id-ID');
  };
  
  // Parse IDR formatted string back to number
  const parseIDR = (value: string): number => {
    return Number(value.replace(/\./g, ''));
  };
  
  const [shoppingItems, setShoppingItems] = useState<{
    id: number;
    name: string;
    price: number;
  }[]>([
    { id: 1, name: "Beras 5kg", price: 70000 },
    { id: 2, name: "Sayur dan Buah", price: 50000 },
    { id: 3, name: "Daging Ayam 1kg", price: 45000 }
  ]);
  
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  
  // Fetch user's budget settings on component mount
  useEffect(() => {
    const fetchBudgetSettings = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('budget_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
            throw error;
          }
          
          if (data) {
            setGajiBulanan(data.monthly_salary);
            // Use nullish coalescing operator to handle potential null or undefined values
            setBelanjaWajib(data.fixed_expenses ?? 0);
          }
        }
      } catch (error) {
        console.error('Error fetching budget settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgetSettings();
  }, []);
  
  // Calculate daily spending limit
  useEffect(() => {
    if (gajiBulanan > 0 && belanjaWajib >= 0) {
      const currentDate = new Date();
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      
      const dailyLimit = (gajiBulanan - belanjaWajib) / daysInMonth;
      setBatasHarian(Math.max(0, dailyLimit));
    }
  }, [gajiBulanan, belanjaWajib]);
  
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
    
    const newItemObj = {
      id: Date.now(),
      name: newItem.name,
      price: price
    };
    
    setShoppingItems([...shoppingItems, newItemObj]);
    setNewItem({ name: "", price: "" });
    
    const totalSpending = [...shoppingItems, newItemObj].reduce(
      (sum, item) => sum + item.price, 0
    );
    
    if (batasHarian > 0 && totalSpending > batasHarian) {
      toast.warning("Peringatan: Belanja hari ini melebihi batas harian!");
    }
  };
  
  const handleRemoveItem = (id: number) => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };
  
  const totalSpending = shoppingItems.reduce(
    (sum, item) => sum + item.price, 0
  );
  
  const isOverBudget = batasHarian > 0 && totalSpending > batasHarian;
  
  const handleSaveIncome = async () => {
    if (gajiBulanan <= 0) {
      toast.error("Gaji bulanan harus lebih dari 0");
      return;
    }
    
    if (belanjaWajib < 0) {
      toast.error("Belanja wajib tidak boleh negatif");
      return;
    }
    
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }
      
      // Check if record exists
      const { data: existingData } = await supabase
        .from('budget_settings')
        .select('id')
        .eq('user_id', user.id);
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('budget_settings')
          .update({
            monthly_salary: gajiBulanan,
            fixed_expenses: belanjaWajib,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Insert new record
        result = await supabase
          .from('budget_settings')
          .insert({
            user_id: user.id,
            monthly_salary: gajiBulanan,
            fixed_expenses: belanjaWajib
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Pengaturan gaji berhasil disimpan");
    } catch (error) {
      console.error('Error saving budget settings:', error);
      toast.error("Gagal menyimpan pengaturan gaji");
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate budget percentage used
  const budgetPercentageUsed = batasHarian > 0 
    ? Math.min((totalSpending / batasHarian) * 100, 100) 
    : 0;
  
  // Handle change for price input with IDR formatting
  const handlePriceChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') {
      setNewItem({...newItem, price: ''});
      return;
    }
    
    // Format as IDR
    const formattedValue = parseInt(numericValue, 10).toLocaleString('id-ID');
    setNewItem({...newItem, price: formattedValue});
  };
  
  return (
    <MainLayout title="Belanja">
      <div className="space-y-6">
        {/* Budget Alert */}
        {isOverBudget && (
          <Alert variant="destructive" className="mb-4 bg-red-50 text-red-800 border-red-200">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Belanja hari ini melebihi batas harian! (Rp {formatIDR(totalSpending)} dari batas Rp {formatIDR(batasHarian)})
            </AlertDescription>
          </Alert>
        )}
        
        <section className="animate-fade-in border border-gray-200 rounded-lg p-4">
          <Card className="border-2">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="gaji-bulanan">Gaji Bulanan (Rp)</Label>
                <Input
                  id="gaji-bulanan"
                  type="text"
                  value={gajiBulanan > 0 ? formatIDR(gajiBulanan) : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setGajiBulanan(value ? parseInt(value, 10) : 0);
                  }}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="belanja-wajib">Belanja Wajib Bulanan (Rp)</Label>
                <Input
                  id="belanja-wajib"
                  type="text"
                  value={belanjaWajib > 0 ? formatIDR(belanjaWajib) : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setBelanjaWajib(value ? parseInt(value, 10) : 0);
                  }}
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-between">
                <Link to="/belanja/gaji">
                  <Button variant="outline" className="text-mibu-purple border-mibu-purple">
                    <BadgeDollarSign size={18} className="mr-2" />
                    Atur Detail Belanja Wajib
                  </Button>
                </Link>
                <Button 
                  onClick={handleSaveIncome} 
                  className="bg-mibu-purple hover:bg-mibu-darkpurple"
                  disabled={loading}
                >
                  <Save size={18} className="mr-2" />
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-mibu-lightgray rounded-lg border border-gray-200">
                <div className="font-medium">Batas Belanja Harian</div>
                <div className="text-xl font-bold text-mibu-purple mt-1">
                  Rp {formatIDR(batasHarian)}
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <Progress value={budgetPercentageUsed} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>{Math.round(budgetPercentageUsed)}% digunakan</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">Set Belanja Hari Ini</h2>
          <Card className="border-2">
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="item-name">Nama Barang</Label>
                  <Input
                    id="item-name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Nama barang"
                    className="mt-1"
                  />
                </div>
                <div className="w-1/3">
                  <Label htmlFor="item-price">Harga (Rp)</Label>
                  <Input
                    id="item-price"
                    value={newItem.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="Harga"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddItem} className="mt-1 bg-mibu-purple hover:bg-mibu-darkpurple">Tambah</Button>
                </div>
              </div>
              
              <div className="mt-4">
                <ul className="space-y-2">
                  {shoppingItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Rp {formatIDR(item.price)}
                        </span>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                <span>Total Belanja</span>
                <span className={isOverBudget ? 'text-red-600' : ''}>
                  Rp {formatIDR(totalSpending)}
                </span>
              </div>
              
              {isOverBudget && (
                <div className="flex items-center p-2 bg-red-50 text-red-800 rounded-md border border-red-200">
                  <AlertTriangle size={20} className="mr-2" />
                  <span className="text-sm">Belanja hari ini melebihi batas harian!</span>
                </div>
              )}
              
              {!isOverBudget && totalSpending > 0 && (
                <div className="flex items-center p-2 bg-green-50 text-green-800 rounded-md border border-green-200">
                  <span className="text-sm">👏 Bagus! Belanja Anda masih dalam batas harian.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Belanja;
