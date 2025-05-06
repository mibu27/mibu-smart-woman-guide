
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
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./hooks/use-toast";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Index />} />
              <Route path="/beranda" element={<ProtectedRoute><Beranda /></ProtectedRoute>} />
              <Route path="/belanja" element={<ProtectedRoute><Belanja /></ProtectedRoute>} />
              <Route path="/belanja/gaji" element={<ProtectedRoute><BelanjaGaji /></ProtectedRoute>} />
              <Route path="/jadwal" element={<ProtectedRoute><Jadwal /></ProtectedRoute>} />
              <Route path="/laporan" element={<ProtectedRoute><Laporan /></ProtectedRoute>} />
              <Route path="/diaryku" element={<ProtectedRoute><DiaryKu /></ProtectedRoute>} />
              <Route path="/diaryku/selfcare" element={<ProtectedRoute><DiaryKu /></ProtectedRoute>} />
              <Route path="/komunitas" element={<ProtectedRoute><Komunitas /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
