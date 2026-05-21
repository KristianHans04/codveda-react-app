import { useState, useMemo } from 'react';
import { useExpenses } from './hooks/useExpenses';
import Header from './components/Header';
import BudgetOverview from './components/BudgetOverview';
import ExpenseForm from './components/ExpenseForm';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import SummaryChart from './components/SummaryChart';
import './App.css';

export default function App() {
  const {
    expenses,
    budget,
    setBudget,
    addExpense,
    deleteExpense,
    totalSpent,
    remaining,
    categoryTotals,
  } = useExpenses();

  const [filter, setFilter] = useState('All');

  const filteredExpenses = useMemo(() => {
    if (filter === 'All') return expenses;
    return expenses.filter((e) => e.category === filter);
  }, [expenses, filter]);

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container">
          <BudgetOverview
            budget={budget}
            setBudget={setBudget}
            totalSpent={totalSpent}
            remaining={remaining}
          />
          <ExpenseForm onAdd={addExpense} />
          <SummaryChart categoryTotals={categoryTotals} totalSpent={totalSpent} />
          <FilterBar filter={filter} setFilter={setFilter} />
          <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
        </div>
      </main>
      <footer className="app-footer">
        <p>Codveda Web Development Internship - Level 2: React App</p>
      </footer>
    </>
  );
}
