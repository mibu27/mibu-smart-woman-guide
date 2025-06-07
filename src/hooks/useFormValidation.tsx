import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateForm } from '@/lib/validationSchemas';
import { toast } from 'sonner';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  showToastOnError?: boolean;
}

export const useFormValidation = <T extends Record<string, any>>({
  schema,
  onSubmit,
  showToastOnError = true
}: UseFormValidationOptions<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: string, value: any) => {
    try {
      // For single field validation, we'll validate the entire object
      // and only keep the error for the specific field
      const tempData = { [name]: value } as Partial<T>;
      schema.parse(tempData);
      
      // If no error, clear the field error
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path.includes(name));
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [name]: fieldError.message
          }));
        }
      }
    }
  }, [schema]);

  const handleSubmit = useCallback(async (data: T) => {
    setIsSubmitting(true);
    setErrors({});

    const validation = validateForm(schema, data);
    
    if (!validation.success) {
      setErrors(validation.errors || {});
      if (showToastOnError) {
        const firstError = Object.values(validation.errors || {})[0];
        if (firstError) {
          toast.error(String(firstError));
        } else {
          toast.error('Form tidak valid');
        }
      }
      setIsSubmitting(false);
      return false;
    }

    try {
      await onSubmit(validation.data);
      setIsSubmitting(false);
      return true;
    } catch (error) {
      setIsSubmitting(false);
      if (showToastOnError) {
        toast.error('Gagal menyimpan data');
      }
      throw error;
    }
  }, [schema, onSubmit, showToastOnError]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((name: string) => {
    return errors[name];
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    isSubmitting,
    validateField,
    handleSubmit,
    clearErrors,
    getFieldError,
    hasErrors
  };
};
