"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TransactionForm from "@/components/TransactionForm"
import TransactionList from "@/components/TransactionList"
import CategoryManager from "@/components/CategoryManager"
import FinanceSummary from "@/components/FinanceSummary"
import type { Transaction, Category } from "@/types"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { exportToCSV } from "@/lib/csv-export"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function Dashboard() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", [])
  const [categories, setCategories] = useLocalStorage<Category[]>("categories", [
    { id: "1", name: "Salary", type: "income" },
    { id: "2", name: "Groceries", type: "expense" },
    { id: "3", name: "Rent", type: "expense" },
    { id: "4", name: "Utilities", type: "expense" },
    { id: "5", name: "Investments", type: "income" },
  ])

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction])
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const addCategory = (category: Category) => {
    setCategories([...categories, category])
  }

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  const handleExportCSV = () => {
    exportToCSV(transactions, "finance-tracker-export")
  }

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-5xl">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#a78bfa]">Personal Finance Tracker</h1>
        <p className="text-muted-foreground">Track your income and expenses to manage your finances better</p>
      </div>

      <FinanceSummary transactions={transactions} />

      <div className="flex justify-end">
        <Button
          onClick={handleExportCSV}
          variant="outline"
          size="sm"
          className="border-[#a78bfa] text-[#a78bfa] hover:bg-[#f5f3ff]"
        >
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add">Add Transaction</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="pt-4">
          <TransactionList transactions={transactions} categories={categories} onDelete={deleteTransaction} />
        </TabsContent>
        <TabsContent value="add" className="pt-4">
          <TransactionForm onSubmit={addTransaction} categories={categories} />
        </TabsContent>
        <TabsContent value="categories" className="pt-4">
          <CategoryManager categories={categories} onAdd={addCategory} onDelete={deleteCategory} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
