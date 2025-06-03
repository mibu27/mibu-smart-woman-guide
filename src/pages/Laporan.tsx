
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp,
  TrendingDown,
  PiggyBank,
  LineChart,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useReportData } from '@/hooks/useReportData';

const tips = [
  "Belanja bulanan sekaligus untuk mengurangi pembelian impulsif.",
  "Kurangi makan di luar dan masak di rumah lebih sering.",
  "Gunakan transportasi umum jika memungkinkan.",
  "Matikan peralatan elektronik yang tidak digunakan.",
  "Buat daftar belanja dan patuhi daftar tersebut."
];

// Colors for pie chart
const COLORS = ['#9b87f5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

const Laporan = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const { 
    monthlyData, 
    categoryData, 
    totalExpenses, 
    budgetInfo, 
    loading, 
    refreshData 
  } = useReportData(period);
  
  // Format for displaying IDR
  const formatIDR = (value: number): string => {
    return value.toLocaleString('id-ID');
  };
  
  // Calculate savings info
  const targetBudget = period === 'weekly' 
    ? ((budgetInfo.monthly_salary - budgetInfo.fixed_expenses) / 4) || 0
    : period === 'monthly'
    ? (budgetInfo.monthly_salary - budgetInfo.fixed_expenses) || 0
    : ((budgetInfo.monthly_salary - budgetInfo.fixed_expenses) * 12) || 0;
    
  const savedAmount = Math.max(0, targetBudget - totalExpenses);
  const isSaved = totalExpenses <= targetBudget;
  const savingsPercentage = targetBudget > 0 ? Math.round((savedAmount / targetBudget) * 100) : 0;
  
  const hasData = totalExpenses > 0 || budgetInfo.monthly_salary > 0;
  
  return (
    <MainLayout title="Laporan">
      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Ringkasan Keuangan</h2>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData} 
                disabled={loading}
                className="text-mibu-purple border-mibu-purple"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
          </div>
          
          {hasData ? (
            <>
              {/* Savings Card */}
              <Card className="mb-5 border-2 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <PiggyBank size={28} className="text-green-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">
                          {isSaved ? 'Total Penghematan' : 'Total Pengeluaran Berlebih'}
                        </div>
                        <div className={`font-bold text-2xl ${isSaved ? 'text-green-600' : 'text-red-600'}`}>
                          Rp {formatIDR(Math.abs(savedAmount))}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Target Anggaran</div>
                      <div className="text-xl font-bold text-mibu-purple">Rp {formatIDR(targetBudget)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Status Card */}
              <Card className="mb-5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Status Pengeluaran {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}</div>
                      <div className="font-medium text-lg">
                        {isSaved ? 'Berhasil Hemat' : 'Pengeluaran Berlebih'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Total Pengeluaran: Rp {formatIDR(totalExpenses)}
                      </div>
                    </div>
                    <div className={`flex items-center ${isSaved ? 'text-green-500' : 'text-red-500'}`}>
                      {isSaved ? <TrendingDown className="mr-1" /> : <TrendingUp className="mr-1" />}
                      <span className="font-bold">
                        {isSaved ? `Hemat ` : `Lebih `}Rp {formatIDR(Math.abs(savedAmount))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Bar Chart */}
              {monthlyData.length > 0 && (
                <Card className="mb-5">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-4">Pengeluaran {period === 'weekly' ? 'Harian' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyData}
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
              )}
              
              {/* Pie Chart - Spending Allocation */}
              {categoryData.length > 0 && (
                <Card className="mb-5">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-4">Alokasi Belanja per Kategori</h3>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `Rp ${formatIDR(value as number)}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="mb-5">
              <CardContent className="p-6 text-center">
                <LineChart size={48} className="mx-auto mb-3 text-mibu-purple opacity-60" />
                <h3 className="font-medium text-lg mb-2">Belum Ada Data Laporan</h3>
                <p className="text-gray-500 mb-4">
                  Mulailah dengan menambahkan data gaji dan pengeluaran untuk melihat laporan keuangan Anda
                </p>
                <div className="flex justify-center gap-3">
                  <Link to="/belanja/gaji" className="text-mibu-purple hover:underline">
                    Atur Gaji
                  </Link>
                  <Link to="/belanja" className="text-mibu-purple hover:underline">
                    Catat Pengeluaran
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
          
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
