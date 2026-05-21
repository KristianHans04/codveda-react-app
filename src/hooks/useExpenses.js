import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook encapsulating all expense CRUD logic.
 * State: Array<{ id: string, description: string, amount: number, category: string, date: string }>
 */
export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage('codveda-expenses', []);
  const [budget, setBudget] = useLocalStorage('codveda-budget', 0);

  const addExpense = useCallback((expense) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
      amount: parseFloat(expense.amount),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, [setExpenses]);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, [setExpenses]);

  const editExpense = useCallback((id, updates) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, ...updates, amount: parseFloat(updates.amount ?? e.amount) } : e
      )
    );
  }, [setExpenses]);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const remaining = useMemo(() => budget - totalSpent, [budget, totalSpent]);

  const categoryTotals = useMemo(() => {
    const map = {};
    for (const e of expenses) {
      map[e.category] = (map[e.category] || 0) + e.amount;
    }
    return Object.entries(map)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  return {
    expenses,
    budget,
    setBudget,
    addExpense,
    deleteExpense,
    editExpense,
    totalSpent,
    remaining,
    categoryTotals,
  };
}
