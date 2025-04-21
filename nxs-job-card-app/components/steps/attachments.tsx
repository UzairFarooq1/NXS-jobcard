"use client"

import type React from "react"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"
import Image from "next/image"

interface AttachmentsProps {
  form: UseFormReturn<any>
}

export default function Attachments({ form }: AttachmentsProps) {
  const [showStampCamera, setShowStampCamera] = useState(false)
  const [showSignatureCamera, setShowSignatureCamera] = useState(false)
  const [stampPreview, setStampPreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)

  const handleFileUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (field === "stampImage") {
        setStampPreview(result)
        form.setValue("stampImage", result)
      } else {
        setSignaturePreview(result)
        form.setValue("signatureImage", result)
      }
    }
    reader.readAsDataURL(file)
  }

  const captureImage = (field: string) => {
    // This is a simplified version - in a real app, you'd use the device camera
    // For now, we'll just simulate by showing the file upload
    if (field === "stampImage") {
      setShowStampCamera(true)
    } else {
      setShowSignatureCamera(true)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Attachments</h2>
      <p className="text-sm text-gray-500">Please upload or capture the institution stamp and client signature.</p>

      <FormField
        control={form.control}
        name="stampImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institution Stamp</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {stampPreview ? (
                  <div className="relative w-full h-48 border rounded-md overflow-hidden">
                    <Image
                      src={stampPreview || "/placeholder.svg"}
                      alt="Institution Stamp"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => {
                        setStampPreview(null)
                        form.setValue("stampImage", "")
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => captureImage("stampImage")}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Capture
                      </Button>
                      <div className="relative flex-1">
                        <Button type="button" variant="outline" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload("stampImage", e)}
                        />
                      </div>
                    </div>
                    {showStampCamera && (
                      <div className="p-4 border rounded-md bg-gray-50">
                        <p className="text-sm text-center mb-2">
                          Please use your device camera to take a photo of the stamp
                        </p>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload("stampImage", e)}
                          />
                          <Button type="button" className="w-full">
                            Open Camera
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="signatureImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Signature</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {signaturePreview ? (
                  <div className="relative w-full h-48 border rounded-md overflow-hidden">
                    <Image
                      src={signaturePreview || "/placeholder.svg"}
                      alt="Client Signature"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => {
                        setSignaturePreview(null)
                        form.setValue("signatureImage", "")
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => captureImage("signatureImage")}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Capture
                      </Button>
                      <div className="relative flex-1">
                        <Button type="button" variant="outline" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload("signatureImage", e)}
                        />
                      </div>
                    </div>
                    {showSignatureCamera && (
                      <div className="p-4 border rounded-md bg-gray-50">
                        <p className="text-sm text-center mb-2">
                          Please use your device camera to take a photo of the signature
                        </p>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload("signatureImage", e)}
                          />
                          <Button type="button" className="w-full">
                            Open Camera
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
