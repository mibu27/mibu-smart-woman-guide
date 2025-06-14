
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BudgetAlertProps {
  isOverBudget: boolean;
  totalSpending: number;
  batasHarian: number;
  formatIDR: (value: number) => string;
}

export const BudgetAlert = ({ isOverBudget, totalSpending, batasHarian, formatIDR }: BudgetAlertProps) => {
  console.log('BudgetAlert data:', {
    isOverBudget,
    totalSpending,
    batasHarian
  });

  if (!isOverBudget || batasHarian <= 0) return null;
  
  return (
    <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Atur rencanamu kembali !</strong> Daftar ini melebihi anggaran tetap harianmu. INI BOROS
        <br />
        <span className="text-sm">
          Total belanja: Rp {formatIDR(totalSpending)} dari batas Rp {formatIDR(batasHarian)}
        </span>
      </AlertDescription>
    </Alert>
  );
};
