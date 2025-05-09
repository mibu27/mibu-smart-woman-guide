
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface BatasBelanjaInfoProps {
  batasHarian: number;
  gajiBulanan: string;
  formatToIDR: (value: string | number) => string;
  parseIDRToNumber: (value: string) => number;
}

const BatasBelanjaInfo = ({
  batasHarian,
  gajiBulanan,
  formatToIDR,
  parseIDRToNumber
}: BatasBelanjaInfoProps) => {
  const hasGaji = parseIDRToNumber(gajiBulanan || '0') > 0;
  
  return (
    <section>
      <h2 className="text-lg font-medium mb-3">Batas Belanja Harian</h2>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="p-6 text-center">
            <AlertCircle size={32} className="mx-auto mb-3 text-orange-500" />
            <p className="mb-2 text-gray-700">Belum ada data gaji yang tersimpan</p>
            <p className="text-sm text-gray-500 mb-4">
              Harap isi informasi gaji bulanan terlebih dahulu untuk melihat batas belanja harian Anda
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BatasBelanjaInfo;
