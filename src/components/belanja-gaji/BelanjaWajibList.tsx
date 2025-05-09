
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Save } from 'lucide-react';
import { MandatoryExpense } from '@/hooks/useBelanjaGaji';

interface BelanjaWajibListProps {
  expensesByCategory: Record<string, MandatoryExpense[]>;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  totalBelanjaWajib: number;
  handleSaveAllExpenses: () => Promise<void>;
  loading: boolean;
  formatToIDR: (value: string | number) => string;
}

const BelanjaWajibList = ({
  expensesByCategory,
  handleEdit,
  handleDelete,
  totalBelanjaWajib,
  handleSaveAllExpenses,
  loading,
  formatToIDR
}: BelanjaWajibListProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        {Object.keys(expensesByCategory).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(expensesByCategory).map(([category, expenses]) => (
              <div key={category} className="border-b last:border-b-0 pb-3 last:pb-0">
                <h3 className="font-medium text-mibu-purple mb-2">{category}</h3>
                <ul className="space-y-2">
                  {expenses.map(expense => (
                    <li key={expense.id} className="flex justify-between items-center">
                      <span>{expense.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Rp {formatToIDR(expense.amount)}
                        </span>
                        <button 
                          onClick={() => handleEdit(expense.id)} 
                          className="p-1 text-gray-500 hover:text-mibu-purple"
                          aria-label="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id)} 
                          className="p-1 text-gray-500 hover:text-red-500"
                          aria-label="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between text-lg font-medium">
              <span>Total Belanja Wajib</span>
              <span className="text-mibu-purple">
                Rp {formatToIDR(totalBelanjaWajib)}
              </span>
            </div>
            
            {/* Save Button for Total Mandatory Expenses */}
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleSaveAllExpenses} 
                className="bg-mibu-purple hover:bg-mibu-darkpurple" 
                disabled={loading}
              >
                <Save size={18} className="mr-2" />
                {loading ? "Menyimpan..." : "Simpan Total Belanja Wajib"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Belum ada pengeluaran wajib yang ditambahkan
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BelanjaWajibList;
