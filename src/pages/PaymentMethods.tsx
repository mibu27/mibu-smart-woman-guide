
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

const PaymentMethods = () => {
  // This would be replaced with actual data from your backend
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2024,
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '5555',
      expMonth: 8,
      expYear: 2025,
      isDefault: false
    }
  ]);

  const [open, setOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd make an API call to your payment processor
    
    // Mock adding a new card
    const newCard: PaymentMethod = {
      id: Math.random().toString(36).substring(7),
      type: 'visa', // This would be detected based on the card number in a real app
      last4: cardNumber.slice(-4),
      expMonth: parseInt(expiryDate.split('/')[0]),
      expYear: parseInt('20' + expiryDate.split('/')[1]),
      isDefault: false
    };
    
    setPaymentMethods([...paymentMethods, newCard]);
    setOpen(false);
    
    // Reset form
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    
    toast.success('Metode pembayaran berhasil ditambahkan');
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(card => card.id !== id));
    toast.success('Metode pembayaran berhasil dihapus');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(card => ({
        ...card,
        isDefault: card.id === id
      }))
    );
    toast.success('Metode pembayaran default berhasil diubah');
  };

  // Helper to format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Helper to format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    
    return v;
  };

  return (
    <MainLayout title="Metode Pembayaran">
      <div className="space-y-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-mibu-darkpurple">
            Metode Pembayaran Tersimpan
          </h2>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-mibu-purple hover:bg-mibu-darkpurple">
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Metode Pembayaran
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Kartu Baru</DialogTitle>
                <DialogDescription>
                  Masukkan detail kartu pembayaran Anda
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddCard}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nama pada Kartu</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Nomor Kartu</Label>
                    <Input
                      id="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Tanggal Kadaluarsa</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={e => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        maxLength={3}
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-mibu-purple hover:bg-mibu-darkpurple">
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map(card => (
              <Card key={card.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard 
                        className={`h-8 w-8 ${
                          card.type === 'visa' ? 'text-blue-600' : 
                          card.type === 'mastercard' ? 'text-red-600' : 
                          'text-gray-600'
                        }`} 
                      />
                      <div>
                        <p className="font-medium">
                          {card.type === 'visa' ? 'Visa' : 
                           card.type === 'mastercard' ? 'Mastercard' : 
                           'Credit Card'}
                          &nbsp;••••&nbsp;{card.last4}
                          {card.isDefault && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          Exp: {card.expMonth}/{card.expYear}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!card.isDefault && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSetDefault(card.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Tidak Ada Metode Pembayaran</CardTitle>
              <CardDescription className="text-center">
                Tambahkan metode pembayaran untuk berlangganan premium
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Button onClick={() => setOpen(true)} className="bg-mibu-purple hover:bg-mibu-darkpurple">
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Metode Pembayaran
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Riwayat Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Belum ada riwayat pembayaran
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PaymentMethods;
