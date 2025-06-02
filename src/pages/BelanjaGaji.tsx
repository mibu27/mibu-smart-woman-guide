
import React from 'react';
import { Plus } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Button } from "@/components/ui/button";
import { useBelanjaGaji } from '@/hooks/useBelanjaGaji';
import GajiInput from '@/components/belanja-gaji/GajiInput';
import BelanjaWajibForm from '@/components/belanja-gaji/BelanjaWajibForm';
import BelanjaWajibList from '@/components/belanja-gaji/BelanjaWajibList';
import BatasBelanjaInfo from '@/components/belanja-gaji/BatasBelanjaInfo';
import TabunganInfo from '@/components/belanja-gaji/TabunganInfo';

const BelanjaGaji = () => {
  const {
    gajiBulanan,
    totalBelanjaWajib,
    batasHarian,
    savings,
    showAddForm,
    loading,
    editMode,
    mandatoryExpenses,
    form,
    formatToIDR,
    parseIDRToNumber,
    handleGajiChange,
    onSubmit,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleSaveIncome,
    handleSaveAllExpenses,
    setShowAddForm,
    cancelEdit
  } = useBelanjaGaji();

  // Group expenses by category for better display
  const expensesByCategory = mandatoryExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<string, typeof mandatoryExpenses>);

  const handleAddExpenseClick = () => {
    if (showAddForm) {
      // If form is showing, cancel it
      cancelEdit();
      setShowAddForm(false);
    } else {
      // If form is not showing, show it and reset any edit mode
      cancelEdit();
      setShowAddForm(true);
    }
  };

  return (
    <MainLayout title="Pengaturan Gaji & Belanja Wajib">
      <div className="space-y-6 animate-fade-in">
        {/* Monthly Salary Section */}
        <GajiInput 
          gajiBulanan={gajiBulanan} 
          handleGajiChange={handleGajiChange}
          handleSaveIncome={handleSaveIncome}
          loading={loading}
        />
        
        {/* Mandatory Expenses Section */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Belanja Wajib Bulanan</h2>
            <Button 
              variant="outline" 
              onClick={handleAddExpenseClick}
              className="text-mibu-purple border-mibu-purple"
            >
              {showAddForm ? (
                <>Batal</>
              ) : (
                <><Plus size={16} className="mr-1" /> Tambah Pengeluaran</>
              )}
            </Button>
          </div>
          
          {/* Form for adding/editing expenses */}
          {showAddForm && (
            <BelanjaWajibForm 
              form={form}
              onSubmit={onSubmit}
              handleUpdate={handleUpdate}
              cancelEdit={cancelEdit}
              editMode={editMode}
              loading={loading}
              formatToIDR={formatToIDR}
            />
          )}
          
          {/* List of mandatory expenses */}
          <BelanjaWajibList 
            expensesByCategory={expensesByCategory}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            totalBelanjaWajib={totalBelanjaWajib}
            handleSaveAllExpenses={handleSaveAllExpenses}
            loading={loading}
            formatToIDR={formatToIDR}
          />
        </section>
        
        {/* Daily Spending Limit Section */}
        <BatasBelanjaInfo 
          batasHarian={batasHarian}
          gajiBulanan={gajiBulanan}
          formatToIDR={formatToIDR}
          parseIDRToNumber={parseIDRToNumber}
        />
        
        {/* Savings Potential Section */}
        <TabunganInfo 
          savings={savings}
          formatToIDR={formatToIDR}
        />
      </div>
    </MainLayout>
  );
};

export default BelanjaGaji;
