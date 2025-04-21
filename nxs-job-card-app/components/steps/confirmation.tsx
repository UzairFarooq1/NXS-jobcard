"use client"

import { CheckCircle2, Download, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

interface ConfirmationProps {
  jobCardId: string | null
  hasPDF: boolean
  isOnline: boolean
  offlineCount: number
}

export default function Confirmation({ jobCardId, hasPDF, isOnline, offlineCount }: ConfirmationProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPDF = async () => {
    if (!jobCardId) return

    try {
      setIsDownloading(true)

      // Fetch the PDF from the server
      const response = await fetch(`/api/pdf/${jobCardId}`)

      if (!response.ok) {
        throw new Error("Failed to download PDF")
      }

      // Get the PDF as a blob
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a link element
      const a = document.createElement("a")
      a.href = url
      a.download = `jobcard-${jobCardId}.pdf`

      // Append the link to the body
      document.body.appendChild(a)

      // Click the link
      a.click()

      // Remove the link
      document.body.removeChild(a)

      // Release the URL
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="text-center py-8 space-y-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>

      <h2 className="text-2xl font-bold">{isOnline ? "Job Card Submitted Successfully!" : "Job Card Saved Offline"}</h2>

      <p className="text-gray-600 max-w-md mx-auto">
        {isOnline
          ? "Your job card has been successfully submitted and sent to the admin."
          : "Your job card has been saved offline and will be submitted when you're back online."}
      </p>

      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 max-w-md mx-auto flex items-start">
          <WifiOff className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
          <div className="text-left text-amber-700 text-sm">
            <p className="font-medium">You're currently offline</p>
            <p>
              Your job card has been saved to your device. When you regain internet connection, please revisit this app
              to sync your data.
            </p>
          </div>
        </div>
      )}

      {isOnline && offlineCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md mx-auto">
          <p className="text-blue-700 text-sm">
            You have {offlineCount} job card(s) saved offline. They will be submitted automatically.
          </p>
        </div>
      )}

      <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
        {isOnline && hasPDF && jobCardId && (
          <Button onClick={downloadPDF} disabled={isDownloading} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>
        )}

        <Button asChild>
          <Link href="/">Submit Another Job Card</Link>
        </Button>
      </div>
    </div>
  )
}
