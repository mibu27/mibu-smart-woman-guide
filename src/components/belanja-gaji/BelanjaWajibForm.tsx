
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BelanjaGajiForm } from '@/hooks/useBelanjaGaji';

interface BelanjaWajibFormProps {
  form: UseFormReturn<BelanjaGajiForm>;
  onSubmit: (data: BelanjaGajiForm) => Promise<void>;
  handleUpdate: () => Promise<void>;
  cancelEdit: () => void;
  editMode: number | null;
  loading: boolean;
  formatToIDR: (value: string | number) => string;
}

const BelanjaWajibForm = ({
  form,
  onSubmit,
  handleUpdate,
  cancelEdit,
  editMode,
  loading,
  formatToIDR
}: BelanjaWajibFormProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(editMode !== null ? handleUpdate : onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                control={form.control} 
                name="name" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pengeluaran</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Listrik, Air, dll" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField 
                control={form.control} 
                name="amount" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah (Rp)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => {
                          const formatted = formatToIDR(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            
            <div className="flex justify-end gap-2">
              {editMode !== null && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Batal
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {editMode !== null ? (
                  <><Save size={18} className="mr-2" /> Perbarui</>
                ) : (
                  <><Save size={18} className="mr-2" /> Simpan Pengeluaran</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BelanjaWajibForm;
