
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  return (
    <section>
      <h2 className="text-lg font-medium mb-3">Batas Belanja Harian</h2>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="text-center p-4 bg-mibu-lightgray rounded-lg">
            <div className="text-sm text-mibu-gray mb-1">Batas Belanja Harian Anda</div>
            <div className="text-2xl font-bold text-mibu-purple">
              Rp {formatToIDR(batasHarian)}
            </div>
            <div className="text-xs text-mibu-gray mt-1">
              Dihitung dari: (Gaji Bulanan - Total Belanja Wajib) ÷ Jumlah hari dalam bulan ini
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>0</span>
              <span>
                Rp {formatToIDR(parseIDRToNumber(gajiBulanan || '0') / 30)}
              </span>
            </div>
            <Progress 
              value={batasHarian / (parseIDRToNumber(gajiBulanan || '0') / 30) * 100} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BatasBelanjaInfo;
