# Level-2-React-App

An advanced expense tracker and budget management app built with **React 19** and **Vite 6**. Features custom hooks for localStorage-synced state management, a category spending chart with CSS bars, budget progress tracking, and a mobile-first Codveda-themed UI.

## Features

- **Budget Overview:** Set a monthly budget. Progress bar shows percentage used, turns red when over budget. Spent vs remaining stats with color coding.
- **Expense Form:** Add expenses with description, amount, category (9 options), and date. Input validation prevents empty or invalid entries.
- **Expense List:** View all expenses with category badge, description, date, and amount. Delete individual expenses. Empty state when no data.
- **Summary Chart:** Horizontal CSS bar chart showing spending breakdown by category, sorted by highest spend. 9 distinct colors.
- **Filter Bar:** Pill-shaped category chips to filter the expense list by category.
- **Persistence:** All data (expenses + budget) automatically saved to and loaded from `localStorage` via a custom `useLocalStorage` hook.
- **No Prop Drilling:** Custom `useExpenses` hook encapsulates all CRUD logic. Props never go deeper than 1 level.

## Component Architecture

```
App
  Header
  BudgetOverview        (budget, setBudget, totalSpent, remaining)
  ExpenseForm           (onAdd)
  SummaryChart          (categoryTotals, totalSpent)
  FilterBar             (filter, setFilter)
  ExpenseList           (expenses, onDelete)
    ExpenseItem         (expense, onDelete)
```

## Custom Hooks

| Hook             | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `useLocalStorage` | Syncs any serializable state with `localStorage` via `useState` + `useEffect` |
| `useExpenses`     | CRUD operations, budget management, derived totals (totalSpent, remaining, categoryTotals) |

## Tech Stack

| Layer       | Technology                  |
| ----------- | --------------------------- |
| Framework   | React 19                    |
| Build Tool  | Vite 6                      |
| Styling     | CSS Modules (per-component) |
| State       | Custom hooks + localStorage |
| Fonts       | Inter (Google Fonts)        |
| Design      | Codveda brand palette       |

## File Structure

```
Level-2-React-App/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx                    Entry point (StrictMode + createRoot)
    App.jsx                     Root component composition
    App.css                     Global reset and layout
    hooks/
      useLocalStorage.js        localStorage sync hook
      useExpenses.js            Expense CRUD + derived state
    components/
      Header.jsx / Header.css
      BudgetOverview.jsx / BudgetOverview.css
      ExpenseForm.jsx / ExpenseForm.css
      ExpenseList.jsx / ExpenseList.css
      ExpenseItem.jsx / ExpenseItem.css
      SummaryChart.jsx / SummaryChart.css
      FilterBar.jsx / FilterBar.css
```

## Live Deployment

| Environment | URL |
|---|---|
| Cloudflare Pages | https://codveda-expenses.pages.dev |
| Custom Domain | https://codveda-expenses.kristianhans.com |

Deployed via **GitHub auto-deploy**: every push to `main` triggers a new Cloudflare Pages build automatically.

## Getting Started

```bash
git clone https://github.com/KristianHans04/codveda-react-app.git
cd codveda-react-app
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

Cloudflare Pages project name: `codveda-expenses`

## Accessibility

- ARIA roles on filter tabs (`tablist`, `tab`), expense list (`list`), and chart bars (`img` with labels).
- Progress bar uses `role="progressbar"` with `aria-valuenow/min/max`.
- All delete buttons have descriptive `aria-label` attributes.
- Empty state uses `role="status"`.

## License

This project is part of the Codveda Web Development Internship program.
