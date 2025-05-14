import type { Transaction } from "@/types"

export function exportToCSV(transactions: Transaction[], filename: string) {
  if (!transactions.length) {
    return
  }

  const headers = ["Date", "Type", "Category", "Amount", "Notes"]

  const rows = transactions.map((transaction) => [
    new Date(transaction.date).toLocaleDateString(),
    transaction.type,
    transaction.category,
    transaction.amount.toString(),
    transaction.notes,
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
