
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  
  // Redirect already logged in users
  useEffect(() => {
    if (user) {
      navigate('/beranda');
    }
  }, [user, navigate]);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error, success } = await signUp(email, password, name);
      
      if (success) {
        toast.success('Pendaftaran berhasil!', {
          description: 'Silahkan login dengan akun yang baru dibuat.'
        });
        
        // In real app with email verification we would stay on this page
        // But for this demo, we'll redirect to login
        setTimeout(() => {
          navigate('/beranda'); 
        }, 1000);
      } else if (error) {
        toast.error('Pendaftaran gagal!', {
          description: error.message
        });
      }
    } catch (error: any) {
      toast.error('Pendaftaran gagal!', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-mibu-lightgray">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-mibu-darkpurple mb-2">MIBU</h1>
          <p className="text-mibu-gray">Daftar untuk Memulai</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-mibu-gray">
                Nama
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mibu-input text-lg"
                placeholder="Nama Lengkap"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-mibu-gray">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mibu-input text-lg"
                placeholder="Email Anda"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-mibu-gray">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mibu-input text-lg"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-lg bg-mibu-purple hover:bg-mibu-darkpurple"
              disabled={loading}
            >
              {loading ? 'LOADING...' : 'DAFTAR'}
            </Button>
          </form>
          
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-4 text-gray-400 text-sm">atau</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full flex items-center justify-center py-5 gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              <span>Daftar dengan Google</span>
            </Button>
            
            <Button variant="outline" className="w-full flex items-center justify-center py-5 gap-2">
              <Facebook className="text-blue-600" size={20} />
              <span>Daftar dengan Facebook</span>
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-mibu-gray">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-mibu-purple font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
