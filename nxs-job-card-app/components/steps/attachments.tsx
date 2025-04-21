"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"
import Image from "next/image"
import { uploadImage } from "@/lib/actions"

interface AttachmentsProps {
  form: UseFormReturn<any>
}

export default function Attachments({ form }: AttachmentsProps) {
  const [stampUploading, setStampUploading] = useState(false)
  const [signatureUploading, setSignatureUploading] = useState(false)

  const handleFileUpload = async (file: File, field: string, setUploading: (loading: boolean) => void) => {
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await uploadImage(file)
      form.setValue(field, imageUrl, { shouldValidate: true })
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  const captureImage = async (field: string, setUploading: (loading: boolean) => void) => {
    try {
      // Check if the browser supports the camera API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser doesn't support camera access")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      // Create video and canvas elements
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // Create canvas and capture image
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)

      // Stop the camera stream
      stream.getTracks().forEach((track) => track.stop())

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8)
      })

      // Create a file from the blob
      const file = new File([blob], `${field}.jpg`, { type: "image/jpeg" })

      // Upload the file
      await handleFileUpload(file, field, setUploading)
    } catch (error) {
      console.error("Error capturing image:", error)
      alert("Error accessing camera. Please check permissions.")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Attachments</h2>
      <p className="text-sm text-gray-500">Please capture or upload the institution stamp and client signature.</p>

      <FormField
        control={form.control}
        name="stampImage"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel>Institution Stamp</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {field.value ? (
                  <div className="relative w-full h-48 border rounded-md overflow-hidden">
                    <Image
                      src={field.value || "/placeholder.svg"}
                      alt="Institution Stamp"
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => form.setValue("stampImage", "", { shouldValidate: true })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      Stamp the institution stamp on a white paper and take a photo
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => captureImage("stampImage", setStampUploading)}
                        disabled={stampUploading}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {stampUploading ? "Capturing..." : "Capture Photo"}
                      </Button>
                      <div className="relative">
                        <Button type="button" variant="outline" disabled={stampUploading}>
                          <Upload className="mr-2 h-4 w-4" />
                          {stampUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], "stampImage", setStampUploading)
                            }
                          }}
                          disabled={stampUploading}
                        />
                      </div>
                    </div>
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
          <FormItem className="space-y-4">
            <FormLabel>Client Signature</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {field.value ? (
                  <div className="relative w-full h-48 border rounded-md overflow-hidden">
                    <Image
                      src={field.value || "/placeholder.svg"}
                      alt="Client Signature"
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => form.setValue("signatureImage", "", { shouldValidate: true })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      Ask the client to sign on a white paper and take a photo
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => captureImage("signatureImage", setSignatureUploading)}
                        disabled={signatureUploading}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {signatureUploading ? "Capturing..." : "Capture Photo"}
                      </Button>
                      <div className="relative">
                        <Button type="button" variant="outline" disabled={signatureUploading}>
                          <Upload className="mr-2 h-4 w-4" />
                          {signatureUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], "signatureImage", setSignatureUploading)
                            }
                          }}
                          disabled={signatureUploading}
                        />
                      </div>
                    </div>
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
