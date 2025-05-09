
import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeDollarSign } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BudgetSummaryProps {
  gajiBulanan: number;
  belanjaWajib: number;
  batasHarian: number;
  budgetPercentageUsed: number;
  formatIDR: (value: number) => string;
}

const BudgetSummary = ({ 
  gajiBulanan,
  belanjaWajib, 
  batasHarian,
  budgetPercentageUsed,
  formatIDR
}: BudgetSummaryProps) => {
  return (
    <section className="animate-fade-in border border-gray-200 rounded-lg p-4">
      <Card className="border-2">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Gaji Bulanan</div>
              <div className="text-lg font-semibold">Rp {formatIDR(gajiBulanan)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Belanja Wajib</div>
              <div className="text-lg font-semibold">Rp {formatIDR(belanjaWajib)}</div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Link to="/belanja/gaji">
              <Button variant="outline" className="text-mibu-purple border-mibu-purple">
                <BadgeDollarSign size={18} className="mr-2" />
                Atur Detail Belanja Wajib
              </Button>
            </Link>
          </div>
          
          <div className="mt-4 p-3 bg-mibu-lightgray rounded-lg border border-gray-200">
            <div className="font-medium">Batas Belanja Harian</div>
            <div className="text-xl font-bold text-mibu-purple mt-1">
              Rp {formatIDR(batasHarian)}
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <Progress value={budgetPercentageUsed} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>{Math.round(budgetPercentageUsed)}% digunakan</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BudgetSummary;
