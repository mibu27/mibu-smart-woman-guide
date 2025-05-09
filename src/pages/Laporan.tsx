
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart as BarChartIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  PiggyBank,
  LineChart
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

// Empty data states
const emptySpendingData = [];
const emptyWeeklyData = [];
const emptyMonthlyData = [];

const tips = [
  "Belanja bulanan sekaligus untuk mengurangi pembelian impulsif.",
  "Kurangi makan di luar dan masak di rumah lebih sering.",
  "Gunakan transportasi umum jika memungkinkan.",
  "Matikan peralatan elektronik yang tidak digunakan.",
  "Buat daftar belanja dan patuhi daftar tersebut."
];

const Laporan = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  
  // Format for displaying IDR
  const formatIDR = (value: number): string => {
    return value.toLocaleString('id-ID');
  };
  
  // Default values for empty state
  const targetBudget = 0;
  const actualSpending = 0;
  const savedAmount = 0;
  const isSaved = true;
  const savingsPercentage = 0;
  
  const hasData = false; // Set to false to show empty state
  
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
          
          {hasData ? (
            <>
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
                        data={period === 'weekly' ? emptyWeeklyData : emptyMonthlyData}
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
                          data={emptySpendingData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {emptySpendingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={"#8884d8"} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `Rp ${formatIDR(value as number)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
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
