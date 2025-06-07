import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { useOfflineHandler } from './useOfflineHandler';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
  errorId: string;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: ''
  });

  const { isOnline, queueOfflineAction } = useOfflineHandler();

  const handleError = useCallback((error: Error, errorInfo?: string) => {
    const errorId = crypto.randomUUID();
    
    console.error('Error caught by error handler:', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error,
      errorInfo: errorInfo || error.message,
      errorId
    });

    // Log error for debugging
    try {
      const errorLog = {
        errorId,
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        errorInfo,
        userAgent: navigator.userAgent,
        url: window.location.href,
        isOnline
      };

      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 20 error logs
      if (existingLogs.length > 20) {
        existingLogs.splice(0, existingLogs.length - 20);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(existingLogs));
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    // Show user-friendly error message
    const userMessage = getUserFriendlyErrorMessage(error);
    
    if (!isOnline) {
      toast.error(userMessage + ' (Sedang offline - akan dicoba lagi saat online)');
      // Queue for retry when online
      queueOfflineAction('retry_failed_action', { error: error.message, timestamp: Date.now() });
    } else {
      toast.error(userMessage);
    }
  }, [isOnline, queueOfflineAction]);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
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
    retry,
    isOnline
  };
};

const getUserFriendlyErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch') || message.includes('failed to fetch')) {
    return "Koneksi bermasalah. Silakan periksa internet Anda dan coba lagi.";
  }
  
  if (message.includes('unauthorized') || message.includes('auth')) {
    return "Sesi Anda telah berakhir. Silakan login kembali.";
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return "Data tidak ditemukan.";
  }
  
  if (message.includes('duplicate') || message.includes('unique')) {
    return "Data sudah ada. Silakan gunakan data yang berbeda.";
  }

  if (message.includes('validation') || message.includes('invalid')) {
    return "Data yang dimasukkan tidak valid. Silakan periksa kembali.";
  }

  if (message.includes('timeout')) {
    return "Koneksi timeout. Silakan coba lagi.";
  }
  
  return "Terjadi kesalahan. Silakan coba lagi dalam beberapa saat.";
};
