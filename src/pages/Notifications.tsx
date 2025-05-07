
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, ShoppingCart, CreditCard, AlertCircle } from 'lucide-react';

const Notifications = () => {
  // This would come from your backend/state management
  const notifications = [
    {
      id: 1,
      title: "Jadwal hari ini: Meeting dengan tim",
      description: "Meeting dengan tim jam 10:00 pagi",
      time: "1 jam yang lalu",
      read: false,
      type: "jadwal"
    },
    {
      id: 2,
      title: "Berhasil menyimpan data belanja",
      description: "Daftar belanja bulanan telah diupdate",
      time: "3 jam yang lalu",
      read: true,
      type: "belanja"
    },
    {
      id: 3,
      title: "Pembayaran Premium berhasil",
      description: "Terima kasih telah berlangganan MIBU Premium",
      time: "1 hari yang lalu",
      read: true,
      type: "pembayaran"
    },
    {
      id: 4,
      title: "Pengingat: Deadline laporan",
      description: "Jangan lupa menyelesaikan laporan minggu ini",
      time: "2 hari yang lalu",
      read: true,
      type: "pengingat"
    }
  ];

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'jadwal':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'belanja':
        return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case 'pembayaran':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
    }
  };

  return (
    <MainLayout title="Notifikasi">
      <div className="space-y-6 py-4">
        {notifications.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-mibu-purple" />
                <span>
                  {notifications.filter(n => !n.read).length} notifikasi belum dibaca
                </span>
              </div>
              <button className="text-sm text-mibu-purple">
                Tandai semua sudah dibaca
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">
                              {notification.title}
                              {!notification.read && (
                                <Badge className="ml-2 bg-mibu-purple">Baru</Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.description}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Tidak Ada Notifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  Tidak ada notifikasi untuk ditampilkan saat ini
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Notifications;
