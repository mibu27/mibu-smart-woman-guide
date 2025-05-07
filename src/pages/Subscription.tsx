
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Star } from 'lucide-react';
import { toast } from "sonner";

const Subscription = () => {
  const handleSubscribe = (plan: string) => {
    // This would be replaced with actual payment processing
    toast.success(`Anda telah memilih paket ${plan}`);
  };

  return (
    <MainLayout title="Langganan Premium">
      <div className="py-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-mibu-darkpurple mb-2">
            Tingkatkan Pengalaman MIBU Anda
          </h2>
          <p className="text-gray-600">
            Pilih paket berlangganan yang sesuai dengan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-blue-500" />
                Basic
              </CardTitle>
              <CardDescription>
                Untuk pengguna baru
              </CardDescription>
              <div className="mt-2">
                <span className="text-2xl font-bold">Gratis</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Akses ke fitur dasar</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Manajemen jadwal</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Pencatatan keuangan sederhana</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Paket Saat Ini
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="border-mibu-purple shadow-md relative">
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
              <span className="bg-mibu-purple text-white text-xs py-1 px-3 rounded-full">
                Paling Populer
              </span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-mibu-purple" />
                Premium
              </CardTitle>
              <CardDescription>
                Untuk pengelolaan kebutuhan sehari-hari
              </CardDescription>
              <div className="mt-2">
                <span className="text-2xl font-bold">Rp 49.000</span>
                <span className="text-sm text-gray-500">/bulan</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Semua fitur Basic</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Analisis keuangan mendalam</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Pengingat kustom</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Fitur self-care premium</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Tanpa iklan</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-mibu-purple hover:bg-mibu-darkpurple"
                onClick={() => handleSubscribe("Premium")}
              >
                Berlangganan Sekarang
              </Button>
            </CardFooter>
          </Card>

          {/* Business Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-amber-500" />
                Business
              </CardTitle>
              <CardDescription>
                Untuk pengelolaan bisnis & keluarga
              </CardDescription>
              <div className="mt-2">
                <span className="text-2xl font-bold">Rp 99.000</span>
                <span className="text-sm text-gray-500">/bulan</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Semua fitur Premium</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Pengelolaan multi-akun</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Laporan keuangan bisnis</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Dukungan prioritas</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Fitur kolaborasi</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSubscribe("Business")}
              >
                Berlangganan Sekarang
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Pertanyaan Umum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Bagaimana cara berlangganan?</h3>
                <p className="text-sm text-gray-600">
                  Anda cukup memilih paket langganan yang diinginkan dan mengikuti proses pembayaran yang tersedia.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Apakah saya bisa membatalkan langganan?</h3>
                <p className="text-sm text-gray-600">
                  Ya, Anda dapat membatalkan langganan kapan saja melalui halaman pengaturan akun.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Apakah ada uji coba gratis?</h3>
                <p className="text-sm text-gray-600">
                  Ya, pengguna baru mendapatkan uji coba Premium gratis selama 7 hari.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscription;
