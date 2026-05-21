import { useState } from 'react';
import './ExpenseForm.css';

const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Other',
];

export default function ExpenseForm({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = description.trim();
    const num = parseFloat(amount);
    if (!trimmed || isNaN(num) || num <= 0) return;

    onAdd({ description: trimmed, amount: num, category, date });
    setDescription('');
    setAmount('');
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit} aria-label="Add expense">
      <div className="form-row">
        <div className="form-group grow">
          <label htmlFor="exp-desc">Description</label>
          <input
            id="exp-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Lunch, taxi, rent..."
            required
            maxLength={100}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exp-amount">Amount</label>
          <input
            id="exp-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group grow">
          <label htmlFor="exp-category">Category</label>
          <select
            id="exp-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="exp-date">Date</label>
          <input
            id="exp-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit" className="form-submit">Add Expense</button>
    </form>
  );
}
