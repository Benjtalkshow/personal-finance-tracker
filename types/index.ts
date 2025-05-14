export interface Transaction {
    id: string
    amount: number
    type: "income" | "expense"
    category: string
    date: Date
    notes: string
    createdAt: Date
  }
  
  export interface Category {
    id: string
    name: string
    type: "income" | "expense"
  }
  