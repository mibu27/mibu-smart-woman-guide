
import { useState, useCallback } from 'react';
import { toast } from "sonner";

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null
  });

  const handleError = useCallback((error: Error, errorInfo?: string) => {
    console.error('Error caught by error handler:', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error,
      errorInfo: errorInfo || error.message
    });

    // Show user-friendly error message
    const userMessage = getUserFriendlyErrorMessage(error);
    toast.error(userMessage);
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }, []);

  const retry = useCallback((retryFunction: () => void | Promise<void>) => {
    clearError();
    try {
      const result = retryFunction();
      if (result instanceof Promise) {
        result.catch(handleError);
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [clearError, handleError]);

  return {
    errorState,
    handleError,
    clearError,
    retry
  };
};

const getUserFriendlyErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return "Koneksi bermasalah. Silakan coba lagi.";
  }
  
  if (message.includes('unauthorized') || message.includes('auth')) {
    return "Sesi Anda telah berakhir. Silakan login kembali.";
  }
  
  if (message.includes('not found')) {
    return "Data tidak ditemukan.";
  }
  
  if (message.includes('duplicate') || message.includes('unique')) {
    return "Data sudah ada. Silakan gunakan data yang berbeda.";
  }
  
  return "Terjadi kesalahan. Silakan coba lagi.";
};
