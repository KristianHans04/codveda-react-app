import './BudgetOverview.css';

export default function BudgetOverview({ budget, setBudget, totalSpent, remaining }) {
  const pct = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const isOver = remaining < 0;

  function handleBudgetChange(e) {
    const val = parseFloat(e.target.value);
    setBudget(isNaN(val) ? 0 : val);
  }

  return (
    <div className="budget-overview">
      <div className="budget-input-row">
        <label htmlFor="budget-input">Monthly Budget</label>
        <div className="budget-field">
          <span className="currency">$</span>
          <input
            type="number"
            id="budget-input"
            value={budget || ''}
            onChange={handleBudgetChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <div className="budget-stats">
        <div className="stat">
          <span className="stat-label">Spent</span>
          <span className="stat-value spent">${totalSpent.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining</span>
          <span className={`stat-value ${isOver ? 'over' : 'under'}`}>
            ${Math.abs(remaining).toFixed(2)}{isOver ? ' over' : ''}
          </span>
        </div>
      </div>
      {budget > 0 && (
        <div className="progress-bar">
          <div
            className={`progress-fill ${isOver ? 'over' : ''}`}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pct.toFixed(0)}% of budget used`}
          />
        </div>
      )}
    </div>
  );
}
