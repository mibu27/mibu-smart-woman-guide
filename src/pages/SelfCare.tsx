
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Heart, Coffee, Moon, Sun, Utensils, Music, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const SelfCare = () => {
  const selfCareCategories = [
    {
      title: "Tidur & Istirahat",
      icon: <Moon className="h-6 w-6" />,
      description: "Tidur yang cukup dan berkualitas",
      tips: ["Tidur 7-8 jam setiap malam", "Hindari layar 1 jam sebelum tidur", "Buat rutinitas tidur yang konsisten"]
    },
    {
      title: "Nutrisi",
      icon: <Utensils className="h-6 w-6" />,
      description: "Pola makan seimbang dan sehat",
      tips: ["Konsumsi protein, karbohidrat, dan lemak sehat", "Makan sayur dan buah setiap hari", "Minum air minimal 2 liter per hari"]
    },
    {
      title: "Relaksasi",
      icon: <Coffee className="h-6 w-6" />,
      description: "Waktu untuk diri sendiri dan relaksasi",
      tips: ["Luangkan waktu 10-15 menit untuk meditasi", "Nikmati hobi yang menenangkan", "Batasi konsumsi kafein dan alkohol"]
    },
    {
      title: "Hiburan",
      icon: <Music className="h-6 w-6" />,
      description: "Aktivitas yang membuat bahagia",
      tips: ["Dengarkan musik favorit", "Tonton film atau acara yang menghibur", "Bermain game atau aktivitas menyenangkan lainnya"]
    },
    {
      title: "Pembelajaran",
      icon: <BookOpen className="h-6 w-6" />,
      description: "Pengembangan diri dan pengetahuan",
      tips: ["Baca buku minimal 15 menit sehari", "Ikuti kursus online", "Kembangkan keterampilan baru"]
    }
  ];

  const dailySelfCareProgress = 60; // Contoh nilai progres

  const handleMarkComplete = () => {
    toast.success("Aktivitas self-care ditandai sebagai selesai!");
  };

  return (
    <MainLayout title="Self Care">
      <div className="space-y-6 py-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <CardTitle>Self Care Harian</CardTitle>
            </div>
            <CardDescription>
              Jaga kesehatan fisik dan mental Anda setiap hari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4 py-2">
              <div className="flex-1">
                <Progress value={dailySelfCareProgress} className="h-2" />
              </div>
              <div className="text-sm font-medium">{dailySelfCareProgress}% Selesai</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selfCareCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {React.cloneElement(category.icon, { className: "text-mibu-purple" })}
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-mibu-purple mt-1 shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleMarkComplete}
                >
                  Tandai Selesai
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Saran Self Care Mingguan</CardTitle>
            <CardDescription>
              Aktivitas yang dapat Anda lakukan untuk merawat diri Anda minggu ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  Meditasi Pagi
                </h4>
                <p className="text-sm text-gray-600">
                  Luangkan 10 menit setiap pagi untuk meditasi dan pernapasan dalam, 
                  ini akan membantu menenangkan pikiran dan menyiapkan hari Anda.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-mibu-purple"
                  onClick={handleMarkComplete}
                >
                  + Tambahkan ke rutinitas
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-brown-500" />
                  Digital Detox
                </h4>
                <p className="text-sm text-gray-600">
                  Tetapkan waktu bebas gadget minimal 1 jam setiap hari untuk 
                  mengurangi stres dan meningkatkan fokus.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-mibu-purple"
                  onClick={handleMarkComplete}
                >
                  + Tambahkan ke rutinitas
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Jurnal Gratitude
                </h4>
                <p className="text-sm text-gray-600">
                  Tuliskan 3 hal yang Anda syukuri setiap malam sebelum tidur
                  untuk meningkatkan kesejahteraan mental.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-mibu-purple"
                  onClick={handleMarkComplete}
                >
                  + Tambahkan ke rutinitas
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Jalan Kaki 30 Menit
                </h4>
                <p className="text-sm text-gray-600">
                  Luangkan waktu untuk berjalan kaki di luar ruangan selama 30 menit,
                  ini baik untuk kesehatan fisik dan mental.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-mibu-purple"
                  onClick={handleMarkComplete}
                >
                  + Tambahkan ke rutinitas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SelfCare;
