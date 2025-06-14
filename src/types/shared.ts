
export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export interface ImportantEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  purchased?: boolean;
}

export interface BudgetData {
  gajiBulanan: number;
  belanjaWajib: number;
  batasHarian: number;
  totalSpending: number;
  budgetPercentageUsed: number;
  isOverBudget: boolean;
}
