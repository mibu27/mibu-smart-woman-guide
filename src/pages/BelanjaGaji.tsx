
import React, { useState, useEffect } from 'react';
import { Save, Edit, BadgeDollarSign, TrendingUp } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

// Define form schema for mandatory expenses
const mandatoryExpenseSchema = z.object({
  name: z.string().min(1, { message: "Nama pengeluaran harus diisi" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Jumlah harus berupa angka positif"
  }),
  category: z.string().min(1, { message: "Kategori harus dipilih" })
});

const BelanjaGaji = () => {
  const [gajiBulanan, setGajiBulanan] = useState<number>(0);
  const [totalBelanjaWajib, setTotalBelanjaWajib] = useState<number>(0);
  const [batasHarian, setBatasHarian] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Sample data for mandatory expenses
  const [mandatoryExpenses, setMandatoryExpenses] = useState<{
    id: number;
    name: string;
    amount: number;
    category: string;
  }[]>([
    { id: 1, name: "Sewa Rumah", amount: 1500000, category: "Tempat Tinggal" },
    { id: 2, name: "Listrik & Air", amount: 500000, category: "Utilitas" },
    { id: 3, name: "Internet", amount: 350000, category: "Langganan" }
  ]);

  const expenseCategories = [
    "Tempat Tinggal",
    "Utilitas",
    "Langganan",
    "Pendidikan",
    "Transportasi",
    "Asuransi",
    "Lainnya"
  ];
  
  // Fetch budget settings from Supabase
  useEffect(() => {
    const fetchBudgetSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('budget_settings')
            .select('monthly_salary')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
            throw error;
          }
          
          if (data) {
            setGajiBulanan(data.monthly_salary);
          }
        }
      } catch (error) {
        console.error('Error fetching budget settings:', error);
      }
    };
    
    fetchBudgetSettings();
  }, []);
  
  // Form for adding new mandatory expense
  const form = useForm<z.infer<typeof mandatoryExpenseSchema>>({
    resolver: zodResolver(mandatoryExpenseSchema),
    defaultValues: {
      name: "",
      amount: "",
      category: ""
    }
  });
  
  // Calculate total mandatory expenses
  useEffect(() => {
    const total = mandatoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalBelanjaWajib(total);
  }, [mandatoryExpenses]);
  
  // Calculate daily spending limit
  useEffect(() => {
    if (gajiBulanan > 0) {
      const currentDate = new Date();
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      
      const dailyLimit = (gajiBulanan - totalBelanjaWajib) / daysInMonth;
      setBatasHarian(Math.max(0, dailyLimit));
      
      // Calculate sample savings (for demo purposes)
      const potentialSavingsPerMonth = gajiBulanan - totalBelanjaWajib;
      setSavings(Math.max(0, potentialSavingsPerMonth * 0.2)); // Assuming 20% of remaining money is saved
    }
  }, [gajiBulanan, totalBelanjaWajib]);
  
  const onSubmit = (data: z.infer<typeof mandatoryExpenseSchema>) => {
    const newExpense = {
      id: Date.now(),
      name: data.name,
      amount: parseFloat(data.amount),
      category: data.category
    };
    
    setMandatoryExpenses([...mandatoryExpenses, newExpense]);
    form.reset();
    setShowAddForm(false);
    toast.success("Pengeluaran wajib berhasil ditambahkan");
  };
  
  const handleEdit = (id: number) => {
    // This would be expanded in a real app to allow editing
    toast.info("Fitur edit akan datang segera");
  };
  
  const handleDelete = (id: number) => {
    setMandatoryExpenses(mandatoryExpenses.filter(item => item.id !== id));
    toast.success("Pengeluaran wajib berhasil dihapus");
  };
  
  const handleSaveIncome = async () => {
    if (gajiBulanan <= 0) {
      toast.error("Gaji bulanan harus lebih dari 0");
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
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Insert new record
        result = await supabase
          .from('budget_settings')
          .insert({
            user_id: user.id,
            monthly_salary: gajiBulanan
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Gaji berhasil disimpan");
    } catch (error) {
      console.error('Error saving budget settings:', error);
      toast.error("Gagal menyimpan gaji");
    } finally {
      setLoading(false);
    }
  };

  // Save all mandatory expenses and total to Supabase
  const handleSaveAllExpenses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }
      
      // Update fixed_expenses with the total mandatory expenses
      const { error } = await supabase
        .from('budget_settings')
        .update({
          fixed_expenses: totalBelanjaWajib,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Total belanja wajib berhasil disimpan");
    } catch (error) {
      console.error('Error saving fixed expenses:', error);
      toast.error("Gagal menyimpan total belanja wajib");
    } finally {
      setLoading(false);
    }
  };
  
  // Group expenses by category for better display
  const expensesByCategory = mandatoryExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<string, typeof mandatoryExpenses>);
  
  return (
    <MainLayout title="Pengaturan Gaji & Belanja Wajib">
      <div className="space-y-6 animate-fade-in">
        <section>
          <h2 className="text-lg font-medium mb-3">Gaji Bulanan</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="gaji-bulanan">Gaji Bulanan (Rp)</Label>
                <div className="flex gap-2 items-center mt-1">
                  <BadgeDollarSign className="text-mibu-purple" />
                  <Input
                    id="gaji-bulanan"
                    type="number"
                    value={gajiBulanan || ""}
                    onChange={(e) => setGajiBulanan(parseFloat(e.target.value) || 0)}
                    placeholder="Masukkan gaji bulanan"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveIncome} disabled={loading}>
                  <Save className="mr-2" size={18} />
                  {loading ? "Menyimpan..." : "Simpan Gaji"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Belanja Wajib Bulanan</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-mibu-purple border-mibu-purple"
            >
              {showAddForm ? "Batal" : "Tambah Pengeluaran"}
            </Button>
          </div>
          
          {showAddForm && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Pengeluaran</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Listrik, Air, dll" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah (Rp)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategori</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              <option value="">Pilih kategori</option>
                              {expenseCategories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save size={18} className="mr-2" />
                        Simpan Pengeluaran
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-4">
              {Object.keys(expensesByCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(expensesByCategory).map(([category, expenses]) => (
                    <div key={category} className="border-b last:border-b-0 pb-3 last:pb-0">
                      <h3 className="font-medium text-mibu-purple mb-2">{category}</h3>
                      <ul className="space-y-2">
                        {expenses.map((expense) => (
                          <li key={expense.id} className="flex justify-between items-center">
                            <span>{expense.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Rp {expense.amount.toLocaleString('id-ID')}
                              </span>
                              <button 
                                onClick={() => handleEdit(expense.id)}
                                className="p-1 text-gray-500 hover:text-mibu-purple"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(expense.id)}
                                className="p-1 text-gray-500 hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3 flex justify-between text-lg font-medium">
                    <span>Total Belanja Wajib</span>
                    <span className="text-mibu-purple">
                      Rp {totalBelanjaWajib.toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  {/* New Save Button for Total Mandatory Expenses */}
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleSaveAllExpenses} 
                      className="bg-mibu-purple hover:bg-mibu-darkpurple"
                      disabled={loading}
                    >
                      <Save size={18} className="mr-2" />
                      {loading ? "Menyimpan..." : "Simpan Total Belanja Wajib"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Belum ada pengeluaran wajib yang ditambahkan
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        
        <section>
          <h2 className="text-lg font-medium mb-3">Batas Belanja Harian</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="text-center p-4 bg-mibu-lightgray rounded-lg">
                <div className="text-sm text-mibu-gray mb-1">Batas Belanja Harian Anda</div>
                <div className="text-2xl font-bold text-mibu-purple">
                  Rp {batasHarian.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-mibu-gray mt-1">
                  Dihitung dari: (Gaji Bulanan - Total Belanja Wajib) ÷ Jumlah hari dalam bulan ini
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>0</span>
                  <span>Rp {(gajiBulanan / 30).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                </div>
                <Progress value={(batasHarian / (gajiBulanan / 30)) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <h2 className="text-lg font-medium mb-3">Sukses Hemat</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp size={32} className="text-green-500" />
                <div>
                  <div className="text-sm text-mibu-gray">Potensi Tabungan Bulanan</div>
                  <div className="text-xl font-bold text-green-500">
                    Rp {savings.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
              
              {savings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
                  Hebat! Dengan pengaturan ini, Anda berpotensi menabung hingga{" "}
                  <span className="font-medium">
                    Rp {(savings * 12).toLocaleString('id-ID')}
                  </span>{" "}
                  dalam setahun.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default BelanjaGaji;
