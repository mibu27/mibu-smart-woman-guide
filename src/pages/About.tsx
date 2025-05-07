
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Heart, Target, Users } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <MainLayout title="Tentang MIBU">
      <div className="space-y-8 py-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <h1 className="text-3xl font-bold text-mibu-darkpurple mb-4">
                Mengelola Uang dengan Bijak
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                MIBU (Mengelola Uang dengan Bijak) adalah platform keuangan personal 
                yang dirancang untuk membantu Anda mengatur budget, mengelola pengeluaran, 
                dan mencapai tujuan keuangan Anda dengan lebih efektif.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-mibu-purple/10 p-4">
                  <Target className="h-8 w-8 text-mibu-purple" />
                </div>
                <h3 className="text-lg font-medium mb-2">Misi Kami</h3>
                <p className="text-gray-600">
                  Membantu setiap orang mengelola keuangannya dengan bijak 
                  dan mencapai kebebasan finansial
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-mibu-purple/10 p-4">
                  <Heart className="h-8 w-8 text-mibu-purple" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nilai Kami</h3>
                <p className="text-gray-600">
                  Transparansi, keamanan, dan kemudahan pengguna adalah 
                  nilai-nilai utama yang menjadi fondasi MIBU
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-mibu-purple/10 p-4">
                  <Users className="h-8 w-8 text-mibu-purple" />
                </div>
                <h3 className="text-lg font-medium mb-2">Komunitas</h3>
                <p className="text-gray-600">
                  Bergabunglah dengan komunitas pengguna MIBU untuk berbagi tips 
                  dan trik pengelolaan keuangan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fitur Unggulan</CardTitle>
            <CardDescription>
              Nikmati berbagai fitur yang memudahkan pengelolaan keuangan Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-mibu-purple mt-0.5" />
              <div>
                <h4 className="font-medium">Manajemen Budget</h4>
                <p className="text-sm text-gray-600">
                  Buat dan kelola budget bulanan dengan mudah
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-mibu-purple mt-0.5" />
              <div>
                <h4 className="font-medium">Pelacakan Pengeluaran</h4>
                <p className="text-sm text-gray-600">
                  Lacak semua pengeluaran Anda dalam satu tempat
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-mibu-purple mt-0.5" />
              <div>
                <h4 className="font-medium">Perencanaan Keuangan</h4>
                <p className="text-sm text-gray-600">
                  Rencanakan keuangan jangka pendek dan jangka panjang
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-mibu-purple mt-0.5" />
              <div>
                <h4 className="font-medium">Laporan Visual</h4>
                <p className="text-sm text-gray-600">
                  Lihat statistik keuangan Anda dalam bentuk grafik yang mudah dipahami
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-mibu-purple mt-0.5" />
              <div>
                <h4 className="font-medium">Jadwal Keuangan</h4>
                <p className="text-sm text-gray-600">
                  Atur jadwal pembayaran dan pengingat tagihan
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-mibu-purple mt-0.5" />
              <div>
                <h4 className="font-medium">Tips Keuangan</h4>
                <p className="text-sm text-gray-600">
                  Dapatkan tips dan saran untuk meningkatkan kesehatan keuangan Anda
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat MIBU</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium">2023</h4>
              <p className="text-sm text-gray-600">
                MIBU diluncurkan sebagai platform keuangan personal yang sederhana dengan fokus pada kemudahan penggunaan.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">2024</h4>
              <p className="text-sm text-gray-600">
                MIBU berkembang dengan menambahkan fitur-fitur baru seperti pelacakan pengeluaran, laporan visual, dan komunitas pengguna.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">2025</h4>
              <p className="text-sm text-gray-600">
                Rencana pengembangan MIBU termasuk integrasi dengan layanan perbankan, aplikasi mobile, dan alat perencanaan keuangan yang lebih canggih.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Bantu Kami Meningkatkan MIBU</h3>
                <p className="text-gray-600">
                  Saran dan masukan Anda sangat berharga untuk pengembangan MIBU yang lebih baik
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">Beri Masukan</Button>
                <Button className="bg-mibu-purple hover:bg-mibu-darkpurple">
                  Bagikan MIBU
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default About;
