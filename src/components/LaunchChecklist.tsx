
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, AlertCircle, Rocket, Calendar, Users, Shield, Bug, Smartphone, Globe } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'security' | 'testing' | 'deployment' | 'monitoring';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  optional?: boolean;
}

const LaunchChecklist = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // CORE FUNCTIONALITY
    {
      id: 'auth-login',
      title: 'Sistem Login/Register',
      description: 'User bisa register, login, dan logout dengan aman',
      category: 'core',
      priority: 'high',
      completed: true
    },
    {
      id: 'budget-setup',
      title: 'Setup Budget & Gaji',
      description: 'User bisa input gaji bulanan dan belanja wajib',
      category: 'core',
      priority: 'high',
      completed: true
    },
    {
      id: 'shopping-list',
      title: 'Daftar Belanja Fungsional',
      description: 'User bisa menambah, menghapus, dan checklist item belanja',
      category: 'core',
      priority: 'high',
      completed: true
    },
    {
      id: 'expense-tracking',
      title: 'Pencatatan Pengeluaran',
      description: 'Otomatis catat pengeluaran saat checklist belanja',
      category: 'core',
      priority: 'high',
      completed: true
    },
    {
      id: 'todo-management',
      title: 'To-Do List Beranda',
      description: 'User bisa checklist to-do di beranda dengan sinkronisasi database',
      category: 'core',
      priority: 'high',
      completed: true
    },
    {
      id: 'schedule-events',
      title: 'Jadwal & Acara',
      description: 'User bisa menambah dan melihat jadwal/acara penting',
      category: 'core',
      priority: 'high',
      completed: true
    },
    {
      id: 'reports-basic',
      title: 'Laporan Keuangan Dasar',
      description: 'Tampilkan laporan mingguan, bulanan, tahunan',
      category: 'core',
      priority: 'high',
      completed: true
    },

    // SECURITY & DATA
    {
      id: 'rls-policies',
      title: 'Row Level Security (RLS)',
      description: 'Semua tabel protected dengan RLS policies',
      category: 'security',
      priority: 'high',
      completed: true
    },
    {
      id: 'data-validation',
      title: 'Validasi Input Data',
      description: 'Semua form input tervalidasi dengan benar',
      category: 'security',
      priority: 'high',
      completed: false
    },
    {
      id: 'error-handling',
      title: 'Error Handling',
      description: 'Error boundaries dan handling untuk semua komponen',
      category: 'security',
      priority: 'high',
      completed: true
    },

    // TESTING & QA
    {
      id: 'test-authentication',
      title: 'Test Authentication Flow',
      description: 'Test register, login, logout, dan session management',
      category: 'testing',
      priority: 'high',
      completed: false
    },
    {
      id: 'test-budget-calc',
      title: 'Test Kalkulasi Budget',
      description: 'Pastikan perhitungan batas harian dan total spending akurat',
      category: 'testing',
      priority: 'high',
      completed: false
    },
    {
      id: 'test-data-sync',
      title: 'Test Sinkronisasi Data',
      description: 'Pastikan data tersinkron antar halaman (beranda, belanja, laporan)',
      category: 'testing',
      priority: 'high',
      completed: false
    },
    {
      id: 'test-mobile-responsive',
      title: 'Test Mobile Responsiveness',
      description: 'Aplikasi berfungsi baik di berbagai ukuran layar mobile',
      category: 'testing',
      priority: 'high',
      completed: false
    },
    {
      id: 'test-offline-behavior',
      title: 'Test Offline Behavior',
      description: 'Aplikasi menangani koneksi internet buruk dengan baik',
      category: 'testing',
      priority: 'medium',
      completed: false,
      optional: true
    },

    // DEPLOYMENT
    {
      id: 'setup-production-db',
      title: 'Setup Production Database',
      description: 'Database production di Supabase siap dengan semua tabel',
      category: 'deployment',
      priority: 'high',
      completed: false
    },
    {
      id: 'domain-setup',
      title: 'Setup Custom Domain',
      description: 'Domain kustom untuk akses aplikasi (opsional untuk testing)',
      category: 'deployment',
      priority: 'low',
      completed: false,
      optional: true
    },
    {
      id: 'ssl-certificate',
      title: 'SSL Certificate',
      description: 'HTTPS aktif untuk keamanan data user',
      category: 'deployment',
      priority: 'high',
      completed: false
    },

    // MONITORING & MAINTENANCE
    {
      id: 'error-logging',
      title: 'Error Logging System',
      description: 'System untuk track dan monitor error di production',
      category: 'monitoring',
      priority: 'medium',
      completed: false,
      optional: true
    },
    {
      id: 'user-feedback',
      title: 'User Feedback Channel',
      description: 'Cara untuk user memberikan feedback selama testing',
      category: 'monitoring',
      priority: 'medium',
      completed: false
    },
    {
      id: 'backup-strategy',
      title: 'Backup Strategy',
      description: 'Strategi backup data user secara regular',
      category: 'monitoring',
      priority: 'medium',
      completed: false,
      optional: true
    }
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Smartphone className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'testing': return <Bug className="w-4 h-4" />;
      case 'deployment': return <Globe className="w-4 h-4" />;
      case 'monitoring': return <AlertCircle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'deployment': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgress = () => {
    const totalRequired = checklist.filter(item => !item.optional).length;
    const completedRequired = checklist.filter(item => !item.optional && item.completed).length;
    return Math.round((completedRequired / totalRequired) * 100);
  };

  const categories = ['core', 'security', 'testing', 'deployment', 'monitoring'];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-mibu-purple" />
            Launch Readiness: {getProgress()}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-mibu-purple h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {checklist.filter(item => !item.optional && item.completed).length} / {checklist.filter(item => !item.optional).length} Item Wajib
            </span>
            <span>
              {checklist.filter(item => item.optional && item.completed).length} Item Opsional
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Checklist by Category */}
      {categories.map(category => {
        const categoryItems = checklist.filter(item => item.category === category);
        const categoryProgress = Math.round(
          (categoryItems.filter(item => item.completed).length / categoryItems.length) * 100
        );

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 capitalize">
                  {getCategoryIcon(category)}
                  {category === 'core' && 'Fungsi Inti'}
                  {category === 'security' && 'Keamanan'}
                  {category === 'testing' && 'Testing & QA'}
                  {category === 'deployment' && 'Deployment'}
                  {category === 'monitoring' && 'Monitoring'}
                </div>
                <Badge variant="outline">{categoryProgress}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryItems.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-0.5 data-[state=checked]:bg-mibu-purple data-[state=checked]:border-mibu-purple"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${item.completed ? 'line-through text-gray-400' : ''}`}>
                          {item.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={getCategoryColor(item.category)}
                        >
                          {item.priority}
                        </Badge>
                        {item.optional && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600">
                            opsional
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm text-gray-600 ${item.completed ? 'line-through' : ''}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Launch Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-mibu-purple" />
            Timeline Testing 1 Bulan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-2 border-mibu-purple pl-4">
              <h4 className="font-medium">Minggu 1: Setup & Core Testing</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Finalisasi semua fungsi inti</li>
                <li>• Test authentication flow</li>
                <li>• Setup production database</li>
                <li>• Deploy ke staging environment</li>
              </ul>
            </div>
            <div className="border-l-2 border-blue-400 pl-4">
              <h4 className="font-medium">Minggu 2: User Testing</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Invite 5-10 beta tester</li>
                <li>• Test semua flow user journey</li>
                <li>• Collect feedback dan bug reports</li>
                <li>• Fix critical issues</li>
              </ul>
            </div>
            <div className="border-l-2 border-green-400 pl-4">
              <h4 className="font-medium">Minggu 3: Optimization</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Performance optimization</li>
                <li>• Mobile responsiveness fine-tuning</li>
                <li>• UX improvements berdasarkan feedback</li>
                <li>• Security audit</li>
              </ul>
            </div>
            <div className="border-l-2 border-purple-400 pl-4">
              <h4 className="font-medium">Minggu 4: Final Testing & Launch</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Final testing semua fitur</li>
                <li>• Setup monitoring & analytics</li>
                <li>• Prepare user documentation</li>
                <li>• Soft launch ke user terbatas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-mibu-purple" />
            Action Items Prioritas Tinggi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checklist
              .filter(item => !item.completed && item.priority === 'high' && !item.optional)
              .map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800">{item.title}</span>
                </div>
              ))}
            {checklist.filter(item => !item.completed && item.priority === 'high' && !item.optional).length === 0 && (
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-800">Semua item prioritas tinggi sudah selesai!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaunchChecklist;
