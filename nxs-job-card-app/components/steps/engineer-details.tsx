"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface EngineerDetailsProps {
  form: UseFormReturn<any>
}

export default function EngineerDetails({ form }: EngineerDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Engineer Details</h2>
      <p className="text-sm text-gray-500">Please provide your information as the field engineer.</p>

      <FormField
        control={form.control}
        name="engineerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="engineerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engineer ID</FormLabel>
            <FormControl>
              <Input placeholder="ENG-12345" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="engineerPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="+1234567890" type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
