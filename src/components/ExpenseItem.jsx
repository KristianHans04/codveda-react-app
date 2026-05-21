import './ExpenseItem.css';

export default function ExpenseItem({ expense, onDelete }) {
  return (
    <div className="expense-item">
      <div className="expense-info">
        <span className="expense-category-badge">{expense.category}</span>
        <span className="expense-desc">{expense.description}</span>
        <span className="expense-date">{expense.date}</span>
      </div>
      <div className="expense-right">
        <span className="expense-amount">${expense.amount.toFixed(2)}</span>
        <button
          className="expense-delete"
          onClick={() => onDelete(expense.id)}
          aria-label={`Delete ${expense.description}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
