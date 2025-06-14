
import { useRealtimeTodos } from './realtime/useRealtimeTodos';
import { useRealtimeEvents } from './realtime/useRealtimeEvents';
import { useUnifiedShopping } from './useUnifiedShopping';

export const useRealtimeBeranda = () => {
  const { todoItems, isLoading: todosLoading, refresh: refreshTodos } = useRealtimeTodos();
  const { importantEvents, isLoading: eventsLoading, refresh: refreshEvents } = useRealtimeEvents();
  const { shoppingList, isLoading: shoppingLoading, refresh: refreshShopping } = useUnifiedShopping();

  const isLoading = todosLoading || eventsLoading || shoppingLoading;

  const refresh = async () => {
    await Promise.all([
      refreshTodos(),
      refreshEvents(), 
      refreshShopping()
    ]);
  };

  return {
    todoItems,
    importantEvents,
    shoppingList,
    isLoading,
    refresh,
    lastUpdated: new Date()
  };
};
