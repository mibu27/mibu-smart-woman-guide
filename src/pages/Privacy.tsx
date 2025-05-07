
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Key, AlertCircle } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <MainLayout title="Privasi & Keamanan">
      <div className="space-y-6 py-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-mibu-purple" />
              Pengaturan Privasi
            </CardTitle>
            <CardDescription>
              Kelola pengaturan privasi akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-mibu-purple" />
                  <h4 className="font-medium">Visibilitas Profil</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tentukan siapa yang dapat melihat profil Anda
                </p>
              </div>
              <div>
                <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option>Semua Orang</option>
                  <option>Hanya Teman</option>
                  <option>Tidak Ada</option>
                </select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-mibu-purple" />
                  <h4 className="font-medium">Visibilitas Aktivitas</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tentukan siapa yang dapat melihat aktivitas Anda
                </p>
              </div>
              <div>
                <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option>Semua Orang</option>
                  <option>Hanya Teman</option>
                  <option>Tidak Ada</option>
                </select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-mibu-purple" />
                  <h4 className="font-medium">Mode Privasi</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sembunyikan semua data Anda dari pengguna lain
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-mibu-purple" />
              Keamanan Akun
            </CardTitle>
            <CardDescription>
              Kelola pengaturan keamanan akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-mibu-purple" />
                  <h4 className="font-medium">Kata Sandi</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Terakhir diubah 30 hari yang lalu
                </p>
              </div>
              <Button variant="outline">Ubah Kata Sandi</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-mibu-purple" />
                  <h4 className="font-medium">Verifikasi Dua Langkah</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tambahkan lapisan keamanan tambahan untuk akun Anda
                </p>
              </div>
              <Button variant="outline">Aktifkan</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-mibu-purple" />
                  <h4 className="font-medium">Perangkat yang Masuk</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Kelola perangkat yang terhubung ke akun Anda
                </p>
              </div>
              <Button variant="outline">Lihat Perangkat</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Privacy;
