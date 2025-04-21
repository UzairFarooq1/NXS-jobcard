"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import EngineerDetails from "./steps/engineer-details"
import ClientDetails from "./steps/client-details"
import MachineDetails from "./steps/machine-details"
import FaultDetails from "./steps/fault-details"
import FinalResult from "./steps/final-result"
import Recommendations from "./steps/recommendations"
import Attachments from "./steps/attachments"
import Confirmation from "./steps/confirmation"
import { submitJobCard } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { saveJobCardOffline, getUnsyncedJobCards, markJobCardAsSynced } from "@/lib/offline-db"
import { useOnlineStatus } from "@/hooks/use-online-status"

// Define the form schema
const formSchema = z.object({
  // Engineer details
  engineerName: z.string().min(2, { message: "Engineer name is required" }),
  engineerId: z.string().min(2, { message: "Engineer ID is required" }),
  engineerPhone: z.string().min(10, { message: "Valid phone number is required" }),

  // Client details
  clientName: z.string().min(2, { message: "Client name is required" }),
  clientCompany: z.string().min(2, { message: "Company name is required" }),
  clientPhone: z.string().min(10, { message: "Valid phone number is required" }),
  clientEmail: z.string().email({ message: "Valid email is required" }),

  // Machine details
  machineName: z.string().min(2, { message: "Machine name is required" }),
  machineSerialNumber: z.string().min(2, { message: "Serial number is required" }),
  machineModel: z.string().optional(),

  // Fault details
  faultDescription: z.string().min(10, { message: "Please describe the fault in detail" }),
  reportedDate: z.date(),

  // Final result
  resolutionStatus: z.enum(["resolved", "partiallyResolved", "unresolved"]),
  resolutionDetails: z.string().min(10, { message: "Please provide resolution details" }),
  partsReplaced: z.string().optional(),

  // Recommendations
  recommendations: z.string().min(10, { message: "Please provide recommendations" }),

  // Attachments
  stampImage: z.string().optional(),
  signatureImage: z.string().optional(),

  // Offline sync flag
  syncedFromOffline: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function JobCardForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [jobCardId, setJobCardId] = useState<string | null>(null)
  const [hasPDF, setHasPDF] = useState(false)
  const { toast } = useToast()
  const isOnline = useOnlineStatus()
  const [offlineCount, setOfflineCount] = useState(0)

  const totalSteps = 7

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      engineerName: "",
      engineerId: "",
      engineerPhone: "",
      clientName: "",
      clientCompany: "",
      clientPhone: "",
      clientEmail: "",
      machineName: "",
      machineSerialNumber: "",
      machineModel: "",
      faultDescription: "",
      reportedDate: new Date(),
      resolutionStatus: "resolved",
      resolutionDetails: "",
      partsReplaced: "",
      recommendations: "",
      stampImage: "",
      signatureImage: "",
      syncedFromOffline: false,
    },
  })

  // Check for unsynchronized job cards when coming online
  useEffect(() => {
    if (isOnline) {
      syncOfflineData()
    }
  }, [isOnline])

  // Count offline job cards
  useEffect(() => {
    async function countOfflineCards() {
      try {
        const unsyncedCards = await getUnsyncedJobCards()
        setOfflineCount(unsyncedCards.length)
      } catch (error) {
        console.error("Error counting offline job cards:", error)
      }
    }

    countOfflineCards()
  }, [isComplete])

  // Sync offline data when coming online
  async function syncOfflineData() {
    try {
      const unsyncedCards = await getUnsyncedJobCards()

      if (unsyncedCards.length > 0) {
        toast({
          title: `Syncing ${unsyncedCards.length} offline job card(s)`,
          description: "Please wait while we upload your offline job cards.",
        })

        for (const card of unsyncedCards) {
          try {
            if (card.id) {
              // Add the offline sync flag
              const formData = { ...card.formData, syncedFromOffline: true }

              // Submit to server
              await submitJobCard(formData)

              // Mark as synced
              await markJobCardAsSynced(card.id)

              toast({
                title: "Job card synced successfully",
                description: `Job card for ${formData.clientCompany} has been uploaded.`,
              })
            }
          } catch (error) {
            console.error("Error syncing job card:", error)
            toast({
              title: "Sync failed",
              description: "Failed to sync an offline job card. It will be retried later.",
              variant: "destructive",
            })
          }
        }

        // Update the count
        const remainingCards = await getUnsyncedJobCards()
        setOfflineCount(remainingCards.length)
      }
    } catch (error) {
      console.error("Error syncing offline data:", error)
    }
  }

  const nextStep = async () => {
    const fields = getFieldsForStep(step)
    const isValid = await form.trigger(fields as any)

    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const getFieldsForStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return ["engineerName", "engineerId", "engineerPhone"]
      case 2:
        return ["clientName", "clientCompany", "clientPhone", "clientEmail"]
      case 3:
        return ["machineName", "machineSerialNumber", "machineModel"]
      case 4:
        return ["faultDescription", "reportedDate"]
      case 5:
        return ["resolutionStatus", "resolutionDetails", "partsReplaced"]
      case 6:
        return ["recommendations"]
      case 7:
        return ["stampImage", "signatureImage"]
      default:
        return []
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      if (isOnline) {
        // Online submission
        const result = await submitJobCard(data)
        setJobCardId(result.jobCardId)
        setHasPDF(result.pdfAvailable)
        setIsComplete(true)
        toast({
          title: "Job card submitted successfully",
          description: "The job card has been sent to the admin.",
        })
      } else {
        // Offline submission
        await saveJobCardOffline(data)
        setIsComplete(true)
        toast({
          title: "Job card saved offline",
          description: "The job card will be submitted when you're back online.",
        })
      }
    } catch (error) {
      console.error("Error submitting job card:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting the job card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <EngineerDetails form={form} />
      case 2:
        return <ClientDetails form={form} />
      case 3:
        return <MachineDetails form={form} />
      case 4:
        return <FaultDetails form={form} />
      case 5:
        return <FinalResult form={form} />
      case 6:
        return <Recommendations form={form} />
      case 7:
        return <Attachments form={form} />
      default:
        return null
    }
  }

  if (isComplete) {
    return <Confirmation jobCardId={jobCardId} hasPDF={hasPDF} isOnline={isOnline} offlineCount={offlineCount} />
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {!isOnline && (
        <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-center text-amber-700">
          <WifiOff className="h-4 w-4 mr-2" />
          <span className="text-sm">
            You're offline. Your job card will be saved locally and submitted when you're back online.
          </span>
        </div>
      )}

      {isOnline && offlineCount > 0 && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center text-blue-700">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <span className="text-sm">
            You have {offlineCount} job card(s) saved offline. They will be submitted automatically.
          </span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full flex-1 mx-1 ${index + 1 <= step ? "bg-primary" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-500">
          Step {step} of {totalSteps}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}

            {step < totalSteps ? (
              <Button type="button" className={step === 1 ? "w-full" : ""} onClick={nextStep}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Job Card
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
