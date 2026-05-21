import './SummaryChart.css';

const COLORS = [
  '#2563eb', '#7296f2', '#103eb2', '#fcb900',
  '#00d084', '#cf2e2e', '#4b4f58', '#e0e3eb', '#1b1f29',
];

export default function SummaryChart({ categoryTotals, totalSpent }) {
  if (categoryTotals.length === 0) return null;

  return (
    <div className="summary-chart" aria-label="Spending by category">
      <h2 className="chart-heading">Spending by Category</h2>
      <div className="chart-bars">
        {categoryTotals.map((item, i) => {
          const pct = totalSpent > 0 ? (item.total / totalSpent) * 100 : 0;
          return (
            <div className="chart-row" key={item.category}>
              <span className="chart-label">{item.category}</span>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  role="img"
                  aria-label={`${item.category}: $${item.total.toFixed(2)} (${pct.toFixed(0)}%)`}
                />
              </div>
              <span className="chart-amount">${item.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
