
import React, { useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Heart, Activity } from 'lucide-react';
import { toast } from "sonner";

// Sample journal entries
const sampleEntries = [
  {
    id: 1,
    date: new Date(2025, 4, 2),
    title: "Hari yang melelahkan",
    content: "Hari ini sangat melelahkan. Banyak pekerjaan rumah yang harus diselesaikan, belum lagi harus mengantar anak-anak ke sekolah dan les tambahan. Tapi aku bersyukur semuanya berjalan dengan lancar."
  },
  {
    id: 2,
    date: new Date(2025, 4, 1),
    title: "Bertemu teman lama",
    content: "Hari ini aku bertemu dengan teman lama di pasar. Sudah hampir 5 tahun tidak bertemu. Rasanya senang sekali bisa mengobrol dan bertukar kabar. Dia terlihat bahagia dengan keluarga barunya."
  }
];

// Mental health prompts
const mentalHealthPrompts = [
  "Bagaimana perasaan Ibu hari ini?",
  "Apa yang membuat Ibu bahagia hari ini?",
  "Apa yang membuat Ibu khawatir saat ini?",
  "Apa yang ingin Ibu syukuri hari ini?",
  "Bagaimana cara Ibu melepaskan stres hari ini?"
];

// Exercise types
const exerciseTypes = [
  "Jalan kaki",
  "Senam",
  "Yoga",
  "Bersepeda",
  "Berenang",
  "Lainnya"
];

const DiaryKu = () => {
  const [activeTab, setActiveTab] = useState("jurnal");
  const [entries, setEntries] = useState(sampleEntries);
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  
  const [mentalHealthEntry, setMentalHealthEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(mentalHealthPrompts[0]);
  
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState("");
  const [exerciseNotes, setExerciseNotes] = useState("");
  const [exerciseHistory, setExerciseHistory] = useState([
    { date: "3 Mei 2025", type: "Jalan kaki", duration: "30 menit", notes: "Jalan pagi di taman kompleks" },
    { date: "1 Mei 2025", type: "Senam", duration: "45 menit", notes: "Ikut kelas senam di aula RT" }
  ]);
  
  const handleSaveJournal = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error("Judul dan isi catatan tidak boleh kosong");
      return;
    }
    
    const newJournalEntry = {
      id: Date.now(),
      date: new Date(),
      title: newEntry.title,
      content: newEntry.content
    };
    
    setEntries([newJournalEntry, ...entries]);
    setNewEntry({ title: "", content: "" });
    toast.success("Catatan berhasil disimpan");
  };
  
  const handleSaveMentalHealth = () => {
    if (!mentalHealthEntry.trim()) {
      toast.error("Mohon isi jawaban terlebih dahulu");
      return;
    }
    
    toast.success("Jawaban berhasil disimpan");
    setMentalHealthEntry("");
    
    // Change to a different prompt
    const randomPrompt = mentalHealthPrompts[Math.floor(Math.random() * mentalHealthPrompts.length)];
    setCurrentPrompt(randomPrompt);
  };
  
  const handleSaveExercise = () => {
    if (!exerciseType || !exerciseDuration) {
      toast.error("Jenis dan durasi aktivitas harus diisi");
      return;
    }
    
    const newExercise = {
      date: format(new Date(), "d MMMM yyyy", { locale: idLocale }),
      type: exerciseType,
      duration: `${exerciseDuration} menit`,
      notes: exerciseNotes
    };
    
    setExerciseHistory([newExercise, ...exerciseHistory]);
    setExerciseType("");
    setExerciseDuration("");
    setExerciseNotes("");
    toast.success("Catatan olahraga berhasil disimpan");
  };
  
  return (
    <MainLayout title="Diaryku">
      <Tabs defaultValue="jurnal" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="jurnal" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>Jurnal</span>
          </TabsTrigger>
          <TabsTrigger value="selfcare" className="flex items-center gap-2">
            <Heart size={16} />
            <span>Selfcare</span>
          </TabsTrigger>
          <TabsTrigger value="olahraga" className="flex items-center gap-2">
            <Activity size={16} />
            <span>Olahraga</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="jurnal" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Catatan Baru</h3>
              <Input 
                placeholder="Judul catatan"
                value={newEntry.title}
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
              />
              <Textarea 
                placeholder="Apa yang ingin Ibu ceritakan hari ini?"
                className="min-h-32"
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveJournal}>Simpan Catatan</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {entries.map(entry => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">
                    {format(entry.date, "d MMMM yyyy", { locale: idLocale })}
                  </div>
                  <h3 className="font-medium text-lg mt-1">{entry.title}</h3>
                  <p className="mt-2 whitespace-pre-wrap">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="selfcare" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-lg">{currentPrompt}</h3>
              <Textarea 
                placeholder="Tulis jawaban Ibu di sini..."
                className="min-h-32"
                value={mentalHealthEntry}
                onChange={(e) => setMentalHealthEntry(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveMentalHealth}>Simpan Jawaban</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Tips Menjaga Kesehatan Mental</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Luangkan waktu untuk diri sendiri setiap hari</li>
                <li>Istirahat yang cukup dan berkualitas</li>
                <li>Batasi penggunaan media sosial</li>
                <li>Berbagi cerita dengan orang terdekat</li>
                <li>Melakukan hobi yang menyenangkan</li>
                <li>Bersyukur untuk hal-hal kecil setiap hari</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="olahraga" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Catat Aktivitas Olahraga</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Jenis Aktivitas</label>
                <select
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Pilih jenis aktivitas</option>
                  {exerciseTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Durasi (menit)</label>
                <Input 
                  type="number" 
                  placeholder="Contoh: 30"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Catatan (opsional)</label>
                <Textarea 
                  placeholder="Bagaimana perasaan Ibu setelah berolahraga?"
                  value={exerciseNotes}
                  onChange={(e) => setExerciseNotes(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveExercise}>Simpan Aktivitas</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Riwayat Aktivitas</h3>
              <div className="space-y-3">
                {exerciseHistory.map((item, index) => (
                  <div key={index} className="p-3 bg-mibu-lightgray rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.type}</span>
                      <span className="text-sm">{item.date}</span>
                    </div>
                    <div className="text-sm mt-1">Durasi: {item.duration}</div>
                    {item.notes && <div className="text-sm mt-1">{item.notes}</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default DiaryKu;
