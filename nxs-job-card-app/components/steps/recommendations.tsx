"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface RecommendationsProps {
  form: UseFormReturn<any>
}

export default function Recommendations({ form }: RecommendationsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recommendations</h2>
      <p className="text-sm text-gray-500">Please provide recommendations to avoid future problems.</p>

      <FormField
        control={form.control}
        name="recommendations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recommendations</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Please provide recommendations to prevent future issues..."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
