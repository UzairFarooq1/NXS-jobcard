import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <WifiOff className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          It looks like you've lost your internet connection. Some features may be limited until you're back online.
        </p>
        <p className="text-gray-600 mb-6">
          Don't worry - you can still create new job cards, and they'll be synchronized when you're back online.
        </p>
        <Button asChild className="w-full">
          <Link href="/">Continue to Job Card App</Link>
        </Button>
      </div>
    </div>
  )
}
