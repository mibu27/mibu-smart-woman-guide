
import { useRealtimeTodos } from './realtime/useRealtimeTodos';
import { useRealtimeEvents } from './realtime/useRealtimeEvents';
import { useCentralizedBudget } from './useCentralizedBudget';

export const useRealtimeBeranda = () => {
  const { todoItems, isLoading: todosLoading, refresh: refreshTodos } = useRealtimeTodos();
  const { importantEvents, isLoading: eventsLoading, refresh: refreshEvents } = useRealtimeEvents();
  const { refreshBudgetData, loading: budgetLoading } = useCentralizedBudget();

  const isLoading = todosLoading || eventsLoading || budgetLoading;

  const refresh = async () => {
    await Promise.all([
      refreshTodos(),
      refreshEvents(), 
      refreshBudgetData()
    ]);
  };

  return {
    todoItems,
    importantEvents,
    isLoading,
    refresh,
    lastUpdated: new Date()
  };
};
