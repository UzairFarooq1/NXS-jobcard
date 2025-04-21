"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface FaultDetailsProps {
  form: UseFormReturn<any>
}

export default function FaultDetails({ form }: FaultDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Fault Details</h2>
      <p className="text-sm text-gray-500">Please describe the fault with the machine.</p>

      <FormField
        control={form.control}
        name="faultDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fault Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Please describe the issue in detail..." className="min-h-[120px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="reportedDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date Reported</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
