"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Confirmation() {
  return (
    <div className="text-center py-8 space-y-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold">Job Card Submitted Successfully!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Your job card has been successfully submitted and sent to the admin. Thank you for completing the form.
      </p>
      <div className="pt-4">
        <Button asChild>
          <Link href="/">Submit Another Job Card</Link>
        </Button>
      </div>
    </div>
  )
}
