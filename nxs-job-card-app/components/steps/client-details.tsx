"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ClientDetailsProps {
  form: UseFormReturn<any>
}

export default function ClientDetails({ form }: ClientDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Client Details</h2>
      <p className="text-sm text-gray-500">Please provide the client's information.</p>

      <FormField
        control={form.control}
        name="clientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person</FormLabel>
            <FormControl>
              <Input placeholder="Jane Smith" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientCompany"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company/Institution Name</FormLabel>
            <FormControl>
              <Input placeholder="Acme Corporation" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientPhone"
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

      <FormField
        control={form.control}
        name="clientEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input placeholder="client@example.com" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
