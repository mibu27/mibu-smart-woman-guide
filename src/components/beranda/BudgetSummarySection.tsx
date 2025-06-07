
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface BudgetSummarySectionProps {
  batasHarian: number;
  totalSpending: number;
  formatIDR: (value: number) => string;
}

export const BudgetSummarySection = ({ 
  batasHarian, 
  totalSpending, 
  formatIDR 
}: BudgetSummarySectionProps) => {
  if (batasHarian <= 0) return null;

  const remainingBudget = Math.max(0, batasHarian - totalSpending);

  return (
    <Card className="bg-gradient-to-r from-mibu-purple/10 to-mibu-pink/10">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Budget Harian</p>
            <p className="text-lg font-semibold text-mibu-purple">Rp {formatIDR(batasHarian)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Sisa Budget</p>
            <p className={`text-lg font-semibold ${remainingBudget > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Rp {formatIDR(remainingBudget)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
