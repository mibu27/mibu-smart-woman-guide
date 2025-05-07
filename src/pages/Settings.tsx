
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Bell, 
  Lock, 
  Globe, 
  Trash2, 
  Moon, 
  Volume2, 
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan");
  };

  return (
    <MainLayout title="Pengaturan Akun">
      <div className="space-y-6 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi</CardTitle>
            <CardDescription>
              Atur preferensi notifikasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-mibu-purple" />
                <div>
                  <p className="font-medium">Notifikasi Jadwal</p>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan pengingat untuk jadwal Anda
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-mibu-purple" />
                <div>
                  <p className="font-medium">Notifikasi Belanja</p>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan pengingat untuk target belanja
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privasi & Keamanan</CardTitle>
            <CardDescription>
              Atur pengaturan privasi dan keamanan akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-mibu-purple" />
                <div>
                  <p className="font-medium">Otentikasi Dua Faktor</p>
                  <p className="text-sm text-muted-foreground">
                    Tambahkan lapisan keamanan ekstra untuk akun Anda
                  </p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EyeOff className="h-5 w-5 text-mibu-purple" />
                <div>
                  <p className="font-medium">Mode Privasi</p>
                  <p className="text-sm text-muted-foreground">
                    Sembunyikan data sensitif di aplikasi
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tampilan</CardTitle>
            <CardDescription>
              Sesuaikan tampilan aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-mibu-purple" />
                <div>
                  <p className="font-medium">Mode Gelap</p>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan mode gelap
                  </p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-mibu-purple" />
                <div>
                  <p className="font-medium">Bahasa</p>
                  <p className="text-sm text-muted-foreground">
                    Bahasa Indonesia
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Ubah
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Zona Berbahaya</CardTitle>
            <CardDescription>
              Tindakan ini tidak dapat dibatalkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Akun Saya
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Simpan Pengaturan
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
