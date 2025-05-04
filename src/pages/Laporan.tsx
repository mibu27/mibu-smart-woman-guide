
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  PiggyBank 
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data, in a real app would come from a backend/API
const spendingData = [
  { name: 'Makanan', value: 1500000 },
  { name: 'Transportasi', value: 500000 },
  { name: 'Pendidikan', value: 800000 },
  { name: 'Utilitas', value: 400000 },
  { name: 'Hiburan', value: 300000 },
];

const weeklyData = [
  { name: 'Min', pengeluaran: 150000 },
  { name: 'Sen', pengeluaran: 200000 },
  { name: 'Sel', pengeluaran: 180000 },
  { name: 'Rab', pengeluaran: 220000 },
  { name: 'Kam', pengeluaran: 240000 },
  { name: 'Jum', pengeluaran: 350000 },
  { name: 'Sab', pengeluaran: 280000 },
];

const monthlyData = [
  { name: 'Jan', pengeluaran: 2000000 },
  { name: 'Feb', pengeluaran: 1800000 },
  { name: 'Mar', pengeluaran: 1900000 },
  { name: 'Apr', pengeluaran: 1700000 },
  { name: 'Mei', pengeluaran: 2100000 },
  { name: 'Jun', pengeluaran: 2200000 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const tips = [
  "Belanja bulanan sekaligus untuk mengurangi pembelian impulsif.",
  "Kurangi makan di luar dan masak di rumah lebih sering.",
  "Gunakan transportasi umum jika memungkinkan.",
  "Matikan peralatan elektronik yang tidak digunakan.",
  "Buat daftar belanja dan patuhi daftar tersebut."
];

const Laporan = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  
  // Choose data based on selected period
  const chartData = period === 'weekly' ? weeklyData : monthlyData;
  
  // Calculate savings/overspending
  const targetBudget = 2000000;
  const actualSpending = spendingData.reduce((sum, item) => sum + item.value, 0);
  const savedAmount = targetBudget - actualSpending;
  const isSaved = savedAmount > 0;

  // Format for displaying IDR
  const formatIDR = (value: number): string => {
    return value.toLocaleString('id-ID');
  };
  
  // Calculate savings percentage
  const savingsPercentage = isSaved ? Math.round((savedAmount / targetBudget) * 100) : 0;
  
  return (
    <MainLayout title="Laporan">
      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Ringkasan Keuangan</h2>
            <div className="flex text-sm border rounded-lg overflow-hidden">
              <button 
                className={`px-3 py-1 ${period === 'weekly' ? 'bg-mibu-purple text-white' : 'bg-white'}`}
                onClick={() => setPeriod('weekly')}
              >
                Mingguan
              </button>
              <button 
                className={`px-3 py-1 ${period === 'monthly' ? 'bg-mibu-purple text-white' : 'bg-white'}`}
                onClick={() => setPeriod('monthly')}
              >
                Bulanan
              </button>
              <button 
                className={`px-3 py-1 ${period === 'yearly' ? 'bg-mibu-purple text-white' : 'bg-white'}`}
                onClick={() => setPeriod('yearly')}
              >
                Tahunan
              </button>
            </div>
          </div>
          
          {/* Savings Card */}
          <Card className="mb-5 border-2 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PiggyBank size={28} className="text-green-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Total Tabungan Anda</div>
                    <div className="font-bold text-2xl text-green-600">
                      Rp {formatIDR(savedAmount)}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Persentase Penghematan</div>
                  <div className="text-xl font-bold text-green-600">{savingsPercentage}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Status Card */}
          <Card className="mb-5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Status Pengeluaran</div>
                  <div className="font-medium text-lg">
                    {isSaved ? 'Berhasil Hemat' : 'Pengeluaran Berlebih'}
                  </div>
                </div>
                <div className={`flex items-center ${isSaved ? 'text-green-500' : 'text-red-500'}`}>
                  {isSaved ? <TrendingDown className="mr-1" /> : <TrendingUp className="mr-1" />}
                  <span className="font-bold">
                    Rp {formatIDR(Math.abs(savedAmount))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Bar Chart */}
          <Card className="mb-5">
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Pengeluaran {period === 'weekly' ? 'Mingguan' : 'Bulanan'}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`Rp ${formatIDR(value as number)}`, 'Pengeluaran']} />
                    <Bar dataKey="pengeluaran" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Pie Chart - Spending Allocation */}
          <Card className="mb-5">
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Alokasi Belanja</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `Rp ${formatIDR(value as number)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Savings Tips */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Saran Penghematan</h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <div className="text-mibu-purple font-bold min-w-6">{index + 1}.</div>
                    <div>{tip}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Laporan;
