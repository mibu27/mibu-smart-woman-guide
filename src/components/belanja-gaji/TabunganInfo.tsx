
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TabunganInfoProps {
  savings: number;
  formatToIDR: (value: string | number) => string;
}

const TabunganInfo = ({
  savings,
  formatToIDR
}: TabunganInfoProps) => {
  return (
    <section>
      <h2 className="text-lg font-medium mb-3">Sukses Hemat</h2>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp size={32} className="text-green-500" />
            <div>
              <div className="text-sm text-mibu-gray">Potensi Tabungan Bulanan</div>
              <div className="text-xl font-bold text-green-500">
                {savings > 0 ? `Rp ${formatToIDR(savings)}` : "Rp 0"}
              </div>
            </div>
          </div>
          
          {savings > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
              Hebat! Dengan pengaturan ini, Anda berpotensi menabung hingga{" "}
              <span className="font-medium">
                Rp {formatToIDR(savings * 12)}
              </span>{" "}
              dalam setahun.
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700 flex items-center gap-2">
              <PlusCircle size={16} />
              <span>
                Atur gaji dan belanja wajib Anda untuk melihat potensi tabungan bulanan.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default TabunganInfo;
