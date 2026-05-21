import { useState, useMemo, useCallback } from 'react';
import { useExpenses } from './hooks/useExpenses';
import './App.css';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'];
const CATEGORY_COLORS = {
  Food: '#10b981', Transport: '#3b82f6', Entertainment: '#8b5cf6',
  Shopping: '#ec4899', Bills: '#f59e0b', Health: '#06b6d4',
  Education: '#6366f1', Other: '#64748b'
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function App() {
  const { expenses, budget, setBudget, addExpense, deleteExpense, editExpense, totalSpent, remaining, categoryTotals } = useExpenses();
  const [filter, setFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Budget alert
  const budgetPercent = budget > 0 ? (totalSpent / budget) * 100 : 0;

  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    let list = [...expenses];
    if (filter !== 'All') list = list.filter(e => e.category === filter);
    if (dateFrom) list = list.filter(e => e.date >= dateFrom);
    if (dateTo) list = list.filter(e => e.date <= dateTo);
    return list;
  }, [expenses, filter, dateFrom, dateTo]);

  // CSV export
  function exportCSV() {
    const header = 'Description,Amount,Category,Date\n';
    const rows = expenses.map(e => `"${e.description}",${e.amount},${e.category},${e.date}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>ExpenseFlow</h1>
        <p>Track spending, set budgets, visualize categories.</p>
      </header>

      {/* Summary Cards */}
      <div className="glass-panel">
        <div className="summary-grid">
          <div className="summary-card">
            <div className={`card-value ${remaining >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(Math.abs(remaining))}
            </div>
            <div className="card-label">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
          </div>
          <div className="summary-card">
            <div className="card-value negative">{formatCurrency(totalSpent)}</div>
            <div className="card-label">Total Spent</div>
          </div>
          <div className="summary-card">
            <div className="card-value accent">{expenses.length}</div>
            <div className="card-label">Transactions</div>
          </div>
          <div className="summary-card">
            <div className="card-value accent">{categoryTotals[0]?.category || '-'}</div>
            <div className="card-label">Top Category</div>
          </div>
        </div>
        <div className="budget-input-row">
          <label>Monthly Budget:</label>
          <input
            type="number"
            value={budget || ''}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="0.00"
            min="0"
            step="50"
          />
        </div>
        {budgetPercent >= 80 && budgetPercent < 100 && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '0.5rem' }}>
            Warning: You have used {budgetPercent.toFixed(0)}% of your budget.
          </p>
        )}
        {budgetPercent >= 100 && budget > 0 && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.5rem' }}>
            Budget exceeded by {formatCurrency(totalSpent - budget)}.
          </p>
        )}
      </div>

      {/* Add Expense Form */}
      <ExpenseFormPanel onAdd={(exp) => { addExpense(exp); if (budget > 0 && totalSpent + exp.amount > budget) showToast('Budget exceeded!', 'danger'); }} />

      {/* Chart */}
      {categoryTotals.length > 0 && (
        <div className="glass-panel chart-section">
          <h3 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>Spending by Category</h3>
          <div className="chart-bar-container">
            {categoryTotals.map(({ category, total }) => (
              <div className="chart-row" key={category}>
                <span className="cat-name">{category}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(total / categoryTotals[0].total) * 100}%`, background: CATEGORY_COLORS[category] || '#64748b' }} />
                </div>
                <span className="bar-amount">{formatCurrency(total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="glass-panel">
        <div className="controls-row">
          <div className="filter-tabs">
            {['All', ...CATEGORIES].map(cat => (
              <button key={cat} className={`filter-tab ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="controls-row" style={{ marginTop: '0.5rem' }}>
          <div className="date-filter">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From date" />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} title="To date" />
          </div>
          <button className="action-btn" onClick={exportCSV}>Export CSV</button>
          {(dateFrom || dateTo) && <button className="action-btn" onClick={() => { setDateFrom(''); setDateTo(''); }}>Clear Dates</button>}
        </div>
      </div>

      {/* Expense List */}
      <div className="glass-panel">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">No expenses recorded yet. Add one above.</div>
        ) : (
          <div className="expense-list">
            {filteredExpenses.map(exp => (
              editingId === exp.id ? (
                <EditRow key={exp.id} expense={exp} onSave={(updates) => { editExpense(exp.id, updates); setEditingId(null); }} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="expense-item" key={exp.id}>
                  <div className="expense-cat-dot" style={{ background: CATEGORY_COLORS[exp.category] || '#64748b' }} />
                  <div className="expense-info">
                    <div className="expense-desc">{exp.description}</div>
                    <div className="expense-meta">{exp.category} &middot; {exp.date}</div>
                  </div>
                  <div className="expense-amount">{formatCurrency(exp.amount)}</div>
                  <div className="expense-actions">
                    <button onClick={() => setEditingId(exp.id)} title="Edit">&#9998;</button>
                    <button className="del-btn" onClick={() => deleteExpense(exp.id)} title="Delete">&times;</button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>ExpenseFlow — Codveda Level 2 React App</p>
      </footer>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}
        </div>
      )}
    </div>
  );
}

/* Expense Form Component (inline) */
function ExpenseFormPanel({ onAdd }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!desc.trim() || !amount || Number(amount) <= 0) return;
    onAdd({ description: desc.trim(), amount: Number(amount), category, date });
    setDesc(''); setAmount('');
  }

  return (
    <div className="glass-panel">
      <form className="expense-form" onSubmit={handleSubmit}>
        <input className="form-input full-width" type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required maxLength={100} />
        <input className="form-input" type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} min="0.01" step="0.01" required />
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <button className="submit-btn full-width" type="submit">Add Expense</button>
      </form>
    </div>
  );
}

/* Edit Row Component */
function EditRow({ expense, onSave, onCancel }) {
  const [desc, setDesc] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);

  return (
    <div className="edit-inline">
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0.01" step="0.01" />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        <button onClick={() => onSave({ description: desc, amount, category })}>Save</button>
        <button onClick={onCancel} style={{ background: 'transparent', border: '1px solid var(--color-glass-border)', color: 'var(--color-text-secondary)' }}>X</button>
      </div>
    </div>
  );
}
