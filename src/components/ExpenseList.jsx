import ExpenseItem from './ExpenseItem';
import './ExpenseList.css';

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty" role="status">
        <p>No expenses recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="expense-list" role="list" aria-label="Expense list">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </div>
  );
}
