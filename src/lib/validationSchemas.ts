
import { z } from 'zod';

// Gaji & Budget validation
export const gajiSchema = z.object({
  gaji: z.string()
    .min(1, "Gaji tidak boleh kosong")
    .refine((val) => {
      const numericValue = val.replace(/\./g, '');
      const number = Number(numericValue);
      return !isNaN(number) && number > 0;
    }, "Gaji harus berupa angka positif yang valid")
    .refine((val) => {
      const numericValue = val.replace(/\./g, '');
      const number = Number(numericValue);
      return number >= 100000;
    }, "Gaji minimal Rp 100.000")
});

export const belanjaWajibSchema = z.object({
  name: z.string()
    .min(1, "Nama pengeluaran tidak boleh kosong")
    .max(100, "Nama pengeluaran maksimal 100 karakter"),
  amount: z.string()
    .min(1, "Jumlah tidak boleh kosong")
    .refine((val) => {
      const numericValue = val.replace(/\./g, '');
      const number = Number(numericValue);
      return !isNaN(number) && number > 0;
    }, "Jumlah harus berupa angka positif yang valid")
});

// Shopping validation
export const shoppingItemSchema = z.object({
  name: z.string()
    .min(1, "Nama barang tidak boleh kosong")
    .max(100, "Nama barang maksimal 100 karakter"),
  price: z.string()
    .min(1, "Harga tidak boleh kosong")
    .refine((val) => {
      const numericValue = val.replace(/\./g, '');
      const number = Number(numericValue);
      return !isNaN(number) && number > 0;
    }, "Harga harus berupa angka positif yang valid")
});

// Task validation
export const taskSchema = z.object({
  title: z.string()
    .min(1, "Judul tugas tidak boleh kosong")
    .max(200, "Judul tugas maksimal 200 karakter"),
  date: z.string()
    .min(1, "Tanggal tidak boleh kosong")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Format tanggal tidak valid"),
  category: z.string().min(1, "Kategori harus dipilih")
});

// Event validation
export const eventSchema = z.object({
  title: z.string()
    .min(1, "Judul acara tidak boleh kosong")
    .max(200, "Judul acara maksimal 200 karakter"),
  description: z.string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
  date: z.string()
    .min(1, "Tanggal tidak boleh kosong")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Format tanggal tidak valid"),
  time: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(val);
    }, "Format waktu tidak valid (HH:MM)"),
  category: z.string().min(1, "Kategori harus dipilih")
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string()
    .min(1, "Nama tidak boleh kosong")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.string()
    .min(1, "Email tidak boleh kosong")
    .email("Format email tidak valid"),
  subject: z.string()
    .min(1, "Subjek tidak boleh kosong")
    .max(200, "Subjek maksimal 200 karakter"),
  message: z.string()
    .min(1, "Pesan tidak boleh kosong")
    .max(1000, "Pesan maksimal 1000 karakter")
});

// Helper untuk validasi form
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);
      return { success: false, data: null, errors };
    }
    return { success: false, data: null, errors: { general: 'Validasi gagal' } };
  }
};
