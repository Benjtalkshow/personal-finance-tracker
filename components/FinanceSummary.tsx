"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Transaction } from "@/types"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { Bar, Pie } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface FinanceSummaryProps {
  transactions: Transaction[]
}

export default function FinanceSummary({ transactions }: FinanceSummaryProps) {
  const summary = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense

    return {
      totalIncome,
      totalExpense,
      balance,
    }
  }, [transactions])

  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return {
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        date,
      }
    }).reverse()

    return last6Months.map(({ month, year, date }) => {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthlyIncome = transactions
        .filter((t) => t.type === "income" && new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth)
        .reduce((sum, t) => sum + t.amount, 0)

      const monthlyExpense = transactions
        .filter((t) => t.type === "expense" && new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth)
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        name: `${month} ${year}`,
        income: monthlyIncome,
        expense: monthlyExpense,
      }
    })
  }, [transactions])

  const barChartData = useMemo(() => {
    const labels = monthlyData.map((item) => item.name)
    const incomeData = monthlyData.map((item) => item.income)
    const expenseData = monthlyData.map((item) => item.expense)

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          backgroundColor: "#a78bfa",
          borderColor: "#a78bfa",
          borderWidth: 1,
        },
        {
          label: "Expense",
          data: expenseData,
          backgroundColor: "#f87171",
          borderColor: "#f87171",
          borderWidth: 1,
        },
      ],
    } as ChartData<"bar">
  }, [monthlyData])

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => "$" + value,
        },
      },
    },
  } as ChartOptions<"bar">

  const categoryData = useMemo(() => {
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, transaction) => {
          const { category, amount } = transaction
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += amount
          return acc
        },
        {} as Record<string, number>,
      )

    return Object.entries(expensesByCategory).map(([category, value]) => ({
      name: category,
      value,
    }))
  }, [transactions])

  const pieChartData = useMemo(() => {
    const labels = categoryData.map((item) => item.name)
    const values = categoryData.map((item) => item.value)

    const COLORS = ["#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff", "#8b5cf6"]

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map((_, index) => COLORS[index % COLORS.length]),
          borderColor: labels.map((_, index) => COLORS[index % COLORS.length]),
          borderWidth: 1,
        },
      ],
    } as ChartData<"pie">
  }, [categoryData])

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: $${value.toFixed(2)} (${percentage}%)`
          },
        },
      },
    },
  } as ChartOptions<"pie">

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>Overview of your financial situation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Income</CardDescription>
              <CardTitle className="text-2xl text-green-600">${summary.totalIncome.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-2xl text-red-600">${summary.totalExpense.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Balance</CardDescription>
              <CardTitle className={`text-2xl ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${summary.balance.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="bar">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bar">Income vs Expenses</TabsTrigger>
            <TabsTrigger value="pie">Expense Breakdown</TabsTrigger>
          </TabsList>
          <TabsContent value="bar" className="pt-4">
            {monthlyData.length > 0 ? (
              <div className="h-[300px] w-full">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">Add transactions to see your financial chart</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="pie" className="pt-4">
            {categoryData.length > 0 ? (
              <div className="h-[300px] w-full">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">Add expense transactions to see category breakdown</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
