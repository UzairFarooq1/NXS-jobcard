"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface FinalResultProps {
  form: UseFormReturn<any>
}

export default function FinalResult({ form }: FinalResultProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Final Result</h2>
      <p className="text-sm text-gray-500">Please provide details about the resolution.</p>

      <FormField
        control={form.control}
        name="resolutionStatus"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Resolution Status</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="resolved" id="resolved" />
                  <Label htmlFor="resolved">Fully Resolved - Machine is working normally</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partiallyResolved" id="partiallyResolved" />
                  <Label htmlFor="partiallyResolved">Partially Resolved - Requires additional parts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unresolved" id="unresolved" />
                  <Label htmlFor="unresolved">Unresolved - Further action required</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="resolutionDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Resolution Details</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Please describe what was done to resolve the issue..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="partsReplaced"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parts Replaced (if any)</FormLabel>
            <FormControl>
              <Textarea placeholder="List any parts that were replaced..." className="min-h-[80px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
