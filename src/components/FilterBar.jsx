import { useState } from 'react';
import './FilterBar.css';

const CATEGORIES = ['All', 'Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Other'];

export default function FilterBar({ filter, setFilter }) {
  return (
    <div className="filter-bar" role="tablist" aria-label="Filter by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`filter-chip ${filter === cat ? 'active' : ''}`}
          role="tab"
          aria-selected={filter === cat}
          onClick={() => setFilter(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
