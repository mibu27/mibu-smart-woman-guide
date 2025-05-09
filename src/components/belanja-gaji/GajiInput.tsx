
import React from 'react';
import { Badge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BadgeDollarSign, Save } from 'lucide-react';

interface GajiInputProps {
  gajiBulanan: string;
  handleGajiChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveIncome: () => void;
  loading: boolean;
}

const GajiInput = ({ 
  gajiBulanan, 
  handleGajiChange, 
  handleSaveIncome, 
  loading 
}: GajiInputProps) => {
  return (
    <section>
      <h2 className="text-lg font-medium mb-3">Gaji Bulanan</h2>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label htmlFor="gaji-bulanan">Gaji Bulanan (Rp)</Label>
            <div className="flex gap-2 items-center mt-1">
              <BadgeDollarSign className="text-mibu-purple" />
              <Input 
                id="gaji-bulanan" 
                type="text"
                value={gajiBulanan} 
                onChange={handleGajiChange} 
                placeholder="Masukkan gaji bulanan" 
                className="flex-1" 
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveIncome} disabled={loading}>
              <Save className="mr-2" size={18} />
              {loading ? "Menyimpan..." : "Simpan Gaji"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GajiInput;
