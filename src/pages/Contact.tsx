
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MessageSquare, MessageCircle, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useFormValidation } from '@/hooks/useFormValidation';
import { contactSchema } from '@/lib/validationSchemas';
import LoadingSpinner from '@/components/ui/loading-spinner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { 
    errors, 
    isSubmitting, 
    validateField, 
    handleSubmit,
    getFieldError 
  } = useFormValidation({
    schema: contactSchema,
    onSubmit: async (data) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Contact form submitted:', data);
      toast.success("Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.");
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <MainLayout title="Hubungi Kami">
      <div className="space-y-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Kirim Pesan</CardTitle>
              <CardDescription>
                Isi formulir di bawah ini untuk mengirim pesan kepada kami
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nama Lengkap *
                  </label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={getFieldError('name') ? 'border-red-500' : ''}
                    placeholder="Masukkan nama lengkap"
                  />
                  {getFieldError('name') && (
                    <p className="text-sm text-red-600">{getFieldError('name')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={getFieldError('email') ? 'border-red-500' : ''}
                    placeholder="contoh@email.com"
                  />
                  {getFieldError('email') && (
                    <p className="text-sm text-red-600">{getFieldError('email')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subjek *
                  </label>
                  <Input 
                    id="subject" 
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={getFieldError('subject') ? 'border-red-500' : ''}
                    placeholder="Subjek pesan"
                  />
                  {getFieldError('subject') && (
                    <p className="text-sm text-red-600">{getFieldError('subject')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Pesan *
                  </label>
                  <Textarea 
                    id="message" 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={getFieldError('message') ? 'border-red-500' : ''}
                    placeholder="Tulis pesan Anda di sini..."
                  />
                  {getFieldError('message') && (
                    <p className="text-sm text-red-600">{getFieldError('message')}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-mibu-purple hover:bg-mibu-darkpurple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Mengirim...</span>
                    </>
                  ) : (
                    'Kirim Pesan'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
                <CardDescription>
                  Beberapa cara untuk menghubungi kami
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-mibu-purple mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a 
                      href="mailto:gradesoffice@gmail.com" 
                      className="text-mibu-purple hover:underline"
                    >
                      gradesoffice@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-mibu-purple mt-0.5" />
                  <div>
                    <h4 className="font-medium">WhatsApp Admin</h4>
                    <a 
                      href="https://wa.me/6285656787625" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-mibu-purple hover:underline"
                    >
                      +62 856-5678-7625
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-mibu-purple mt-0.5" />
                  <div>
                    <h4 className="font-medium">Jam Operasional</h4>
                    <p className="text-sm text-gray-600">
                      Senin - Jumat: 09:00 - 17:00 WIB
                      <br />
                      Sabtu: 09:00 - 15:00 WIB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dukungan Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full flex justify-start gap-2"
                  onClick={() => window.open('https://wa.me/6285656787625', '_blank')}
                >
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  Chat WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex justify-start gap-2"
                  onClick={() => window.open('mailto:gradesoffice@gmail.com', '_blank')}
                >
                  <Mail className="h-4 w-4 text-blue-500" />
                  Kirim Email
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex justify-start gap-2"
                >
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  Live Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
