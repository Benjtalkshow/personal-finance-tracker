# Personal Finance Tracker

A simple app to track your money. You can record your income and expenses, create categories, and see charts of your spending.


## Features

- **Add Transactions**: Record your income and expenses with date, amount, category, and notes
- **Categories**: Create your own categories for income and expenses
- **Dashboard**: See your total income, expenses, and balance
- **Charts**: View charts showing your income vs expenses and spending by category
- **Filter & Search**: Find transactions by date, category, or keyword
- **Export**: Download your transaction data as a CSV file
- **Data Storage**: All data is saved in your browser, so it's there when you come back

## Setup Instructions

### Option 1: Quick Start

1. Clone this repository
2. Go to the project folder
3. Install the packages by running `npm install`
4. Start the app by running `npm run dev`

### Your app should be running on `http://localhost:3000`


## How to Use

### Adding Transactions

1. Click on the "Add Transaction" tab
2. Choose if it's income or expense
3. Enter the amount
4. Select a category (or create a new one in the Categories tab)
5. Pick a date
6. Add notes if you want
7. Click "Add Transaction"

### Managing Categories

1. Click on the "Categories" tab
2. Enter a name for your new category
3. Choose if it's for income or expense
4. Click "Add Category"
5. To delete a category, click the trash icon next to it

### Viewing Your Finances

- The dashboard shows your total income, expenses, and balance
- You can see charts of your income vs expenses over time
- You can also see a breakdown of your expenses by category

### Finding Transactions

1. Go to the "Transactions" tab
2. Use the search box to find transactions by keyword
3. Use the filters to show only certain types or categories
4. Click on the column headers to sort by date, category, or amount

### Exporting Data

- Click the "Export to CSV" button to download your transaction data

## Technologies Used

- Next.js and React
- TypeScript
- Tailwind CSS
- Chartjs for data visualization
- Local Storage for saving data

