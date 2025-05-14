"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Transaction, Category } from "@/types"
import { Trash2, Search, ArrowUpDown } from "lucide-react"

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  onDelete: (id: string) => void
}

type SortField = "date" | "amount" | "category"
type SortDirection = "asc" | "desc"

export default function TransactionList({ transactions, categories, onDelete }: TransactionListProps) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const getCategoryName = (id: string) => {
    const category = categories.find((c) => c.id === id)
    return category ? category.name : "Unknown"
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        // Search filter
        const searchLower = search.toLowerCase()
        const matchesSearch =
          getCategoryName(transaction.category).toLowerCase().includes(searchLower) ||
          transaction.notes.toLowerCase().includes(searchLower) ||
          transaction.amount.toString().includes(searchLower)

        // Category filter
        const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter

        // Type filter
        const matchesType = typeFilter === "all" || transaction.type === typeFilter

        return matchesSearch && matchesCategory && matchesType
      })
      .sort((a, b) => {
        if (sortField === "date") {
          return sortDirection === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime()
        } else if (sortField === "amount") {
          return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
        } else if (sortField === "category") {
          const categoryA = getCategoryName(a.category).toLowerCase()
          const categoryB = getCategoryName(b.category).toLowerCase()
          return sortDirection === "asc" ? categoryA.localeCompare(categoryB) : categoryB.localeCompare(categoryA)
        }
        return 0
      })
  }, [transactions, search, categoryFilter, typeFilter, sortField, sortDirection])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>View and manage your financial transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f5f3ff]">
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("date")}>
                      <div className="flex items-center">
                        Date
                        {sortField === "date" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("category")}>
                      <div className="flex items-center">
                        Category
                        {sortField === "category" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => toggleSort("amount")}>
                      <div className="flex items-center justify-end">
                        Amount
                        {sortField === "amount" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getCategoryName(transaction.category)}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{transaction.notes || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(transaction.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No transactions found</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
