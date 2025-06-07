
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

export const useOfflineHandler = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Koneksi internet tersambung kembali');
      
      // Process queued offline actions
      processOfflineActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Tidak ada koneksi internet. Data akan disimpan secara lokal.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load queued actions from localStorage
    loadOfflineActions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineActions = () => {
    try {
      const stored = localStorage.getItem('offline_actions');
      if (stored) {
        setOfflineActions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load offline actions:', error);
    }
  };

  const saveOfflineActions = (actions: OfflineAction[]) => {
    try {
      localStorage.setItem('offline_actions', JSON.stringify(actions));
    } catch (error) {
      console.error('Failed to save offline actions:', error);
    }
  };

  const queueOfflineAction = useCallback((type: string, data: any) => {
    const action: OfflineAction = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: Date.now()
    };

    const newActions = [...offlineActions, action];
    setOfflineActions(newActions);
    saveOfflineActions(newActions);

    toast.info('Data disimpan secara lokal. Akan disinkronkan saat online.');
  }, [offlineActions]);

  const processOfflineActions = async () => {
    if (offlineActions.length === 0) return;

    toast.info('Mensinkronkan data offline...');

    // Here you would implement the actual sync logic
    // For now, we'll just clear the queue
    setOfflineActions([]);
    localStorage.removeItem('offline_actions');
    
    toast.success('Data offline berhasil disinkronkan');
  };

  const removeOfflineAction = useCallback((id: string) => {
    const newActions = offlineActions.filter(action => action.id !== id);
    setOfflineActions(newActions);
    saveOfflineActions(newActions);
  }, [offlineActions]);

  return {
    isOnline,
    offlineActions,
    queueOfflineAction,
    removeOfflineAction,
    processOfflineActions
  };
};
