
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, ChevronDown, ChevronUp, Search, Book, Video } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Help = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  const faqs = [
    {
      question: "Bagaimana cara mengatur budget bulanan?",
      answer: "Untuk mengatur budget bulanan, kunjungi halaman BelanjaKu dan klik pada tab 'Set Gaji'. Disana Anda dapat memasukkan gaji bulanan dan mengalokasikan untuk pengeluaran wajib. Sistem akan otomatis menghitung sisa uang yang tersedia untuk digunakan."
    },
    {
      question: "Apakah data keuangan saya aman?",
      answer: "Ya, MIBU menggunakan enkripsi tingkat tinggi untuk melindungi data keuangan Anda. Kami tidak menyimpan informasi sensitif seperti nomor kartu kredit atau detail rekening bank. Data Anda juga tidak dibagikan kepada pihak ketiga tanpa izin Anda."
    },
    {
      question: "Bagaimana cara menggunakan fitur JadwalKu?",
      answer: "Fitur JadwalKu memungkinkan Anda mengatur jadwal kegiatan, membuat pengingat, dan melihat kalender aktivitas. Kunjungi halaman JadwalKu, klik 'Tambah Jadwal' dan isi detail kegiatan yang ingin Anda jadwalkan. Anda akan mendapatkan notifikasi sesuai pengaturan pengingat yang Anda pilih."
    },
    {
      question: "Apakah saya bisa mengakses MIBU di perangkat lain?",
      answer: "Ya, MIBU dapat diakses dari berbagai perangkat melalui browser web. Cukup masuk dengan akun Anda untuk melihat data yang telah tersinkronisasi. Kami juga berencana mengembangkan aplikasi mobile dalam waktu dekat."
    },
    {
      question: "Bagaimana cara berlangganan MIBU Premium?",
      answer: "Untuk berlangganan MIBU Premium, kunjungi halaman Langganan Premium di menu sidebar. Pilih paket berlangganan yang sesuai dengan kebutuhan Anda dan ikuti petunjuk pembayaran. Setelah pembayaran berhasil, akun Anda akan langsung diupgrade ke Premium."
    }
  ];

  const categories = [
    { name: "Mulai Menggunakan", icon: <Book className="h-5 w-5" /> },
    { name: "Video Tutorial", icon: <Video className="h-5 w-5" /> },
    { name: "Akun & Tagihan", icon: <HelpCircle className="h-5 w-5" /> },
    { name: "FAQ Umum", icon: <HelpCircle className="h-5 w-5" /> }
  ];

  return (
    <MainLayout title="Pusat Bantuan">
      <div className="space-y-6 py-4">
        <div className="flex flex-col items-center text-center mb-8 mt-4">
          <HelpCircle className="h-12 w-12 text-mibu-purple mb-4" />
          <h2 className="text-2xl font-bold text-mibu-darkpurple mb-2">Bagaimana kami bisa membantu?</h2>
          <p className="text-gray-600 max-w-lg mb-4">
            Cari bantuan dari database pusat bantuan kami atau telusuri FAQ populer di bawah ini
          </p>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input 
              className="pl-10" 
              placeholder="Cari pertanyaan atau bantuan..." 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="hover:bg-gray-50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="mb-2 rounded-full bg-mibu-purple/10 p-3">
                  {React.cloneElement(category.icon, { className: "h-6 w-6 text-mibu-purple" })}
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Umum</CardTitle>
            <CardDescription>
              Temukan jawaban untuk pertanyaan yang sering diajukan pengguna
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-4 cursor-pointer"
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{faq.question}</h3>
                  {activeQuestion === index ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </div>
                {activeQuestion === index && (
                  <div className="mt-2 text-gray-600 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Tidak menemukan yang Anda cari?</h3>
              <p className="text-gray-600 text-sm">
                Jika Anda memiliki pertanyaan lain, silakan hubungi tim dukungan kami
              </p>
            </div>
            <Button className="bg-mibu-purple hover:bg-mibu-darkpurple">
              Hubungi Dukungan
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Help;
