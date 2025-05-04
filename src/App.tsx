
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Beranda from "./pages/Beranda";
import Belanja from "./pages/Belanja";
import BelanjaGaji from "./pages/BelanjaGaji";
import Jadwal from "./pages/Jadwal";
import Laporan from "./pages/Laporan";
import DiaryKu from "./pages/DiaryKu";
import Komunitas from "./pages/Komunitas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Index />} />
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/belanja" element={<Belanja />} />
          <Route path="/belanja/gaji" element={<BelanjaGaji />} />
          <Route path="/jadwal" element={<Jadwal />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/diaryku" element={<DiaryKu />} />
          <Route path="/diaryku/selfcare" element={<DiaryKu />} />
          <Route path="/komunitas" element={<Komunitas />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
