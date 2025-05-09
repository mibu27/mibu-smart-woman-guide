
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BudgetAlertProps {
  isOverBudget: boolean;
  totalSpending: number;
  batasHarian: number;
  formatIDR: (value: number) => string;
}

const BudgetAlert = ({ isOverBudget, totalSpending, batasHarian, formatIDR }: BudgetAlertProps) => {
  if (!isOverBudget) return null;
  
  return (
    <Alert variant="destructive" className="mb-4 bg-red-50 text-red-800 border-red-200">
      <AlertTriangle className="h-4 w-4 mr-2" />
      <AlertDescription>
        Belanja hari ini melebihi batas harian! (Rp {formatIDR(totalSpending)} dari batas Rp {formatIDR(batasHarian)})
      </AlertDescription>
    </Alert>
  );
};

export default BudgetAlert;
