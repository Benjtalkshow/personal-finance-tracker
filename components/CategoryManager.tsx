"use client"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { Category } from "@/types"

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["income", "expense"]),
})

type FormValues = z.infer<typeof formSchema>

interface CategoryManagerProps {
  categories: Category[]
  onAdd: (category: Category) => void
  onDelete: (id: string) => void
}

export default function CategoryManager({ categories, onAdd, onDelete }: CategoryManagerProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "expense",
    },
  })

  const handleSubmit = (values: FormValues) => {
    const category: Category = {
      id: uuidv4(),
      name: values.name,
      type: values.type,
    }

    onAdd(category)
    form.reset({
      name: "",
      type: "expense",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
          <CardDescription>Create custom categories for your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Groceries" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-[#a78bfa] hover:bg-[#9061f9] text-white">
                Add Category
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>View and delete your transaction categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Income Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((category) => category.type === "income")
                  .map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="flex items-center gap-1 py-1.5 border-[#a78bfa] text-[#a78bfa]"
                    >
                      {category.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => onDelete(category.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </Badge>
                  ))}
                {categories.filter((category) => category.type === "income").length === 0 && (
                  <p className="text-sm text-muted-foreground">No income categories</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Expense Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((category) => category.type === "expense")
                  .map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="flex items-center gap-1 py-1.5 border-[#a78bfa] text-[#a78bfa]"
                    >
                      {category.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => onDelete(category.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </Badge>
                  ))}
                {categories.filter((category) => category.type === "expense").length === 0 && (
                  <p className="text-sm text-muted-foreground">No expense categories</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
