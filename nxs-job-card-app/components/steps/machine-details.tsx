"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface MachineDetailsProps {
  form: UseFormReturn<any>
}

export default function MachineDetails({ form }: MachineDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Machine Details</h2>
      <p className="text-sm text-gray-500">Please provide details about the machine being serviced.</p>

      <FormField
        control={form.control}
        name="machineName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Machine Name</FormLabel>
            <FormControl>
              <Input placeholder="Printer XYZ" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="machineSerialNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Serial Number</FormLabel>
            <FormControl>
              <Input placeholder="SN-12345-ABC" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="machineModel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Model ABC-123" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
