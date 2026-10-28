# SpendWise — Personal Expense Manager

Cook N Klean Web Development Internship — Week 2 (Option B)

## Features
- Add, view, edit and delete expenses (CRUD)
- Title, amount and category validation
- Total spending, transaction count and highest-spending category
- Search and category filter
- Persistent browser LocalStorage using JSON.stringify / JSON.parse
- Responsive desktop and mobile layout

## Run
Open index.html in a browser. No installation or backend required.

## Test checklist
1. Add a valid expense and confirm it appears in the table and totals.
2. Try empty title, zero/negative amount, more than two decimals and no category; verify errors.
3. Edit a record and confirm the table and totals update.
4. Delete a record and confirm it disappears.
5. Refresh the browser and confirm records remain.
6. Search by title and filter by category.
7. Check mobile layout.
8. Open DevTools > Application > Local Storage and capture the spendwise_expenses_v1 entry.

## Submission screenshots
Save screenshots in screenshots/: dashboard with sample expenses, editing an expense, validation error, and DevTools LocalStorage. These must be captured in your own browser after testing.

## Files
- index.html — structure
- style.css — responsive styling
- script.js — event handlers, DOM updates, validation and persistence
