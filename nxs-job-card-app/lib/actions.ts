"use server"

import { put } from "@vercel/blob"
import { Resend } from "resend"
import JobCardEmail from "@/components/email/job-card-email"

// Initialize Resend (you'll need to add RESEND_API_KEY to your environment variables)
let resend: Resend
try {
  resend = new Resend(process.env.RESEND_API_KEY)
} catch (error) {
  console.error("Failed to initialize Resend:", error)
}

export async function uploadImage(file: File) {
  try {
    const filename = `${Date.now()}-${file.name}`
    const { url } = await put(filename, file, {
      access: "public",
    })
    return url
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error)
    throw new Error("Failed to upload image")
  }
}

export async function submitJobCard(data: any) {
  try {
    // Format the data for email
    const formattedData = {
      ...data,
      reportedDate: data.reportedDate ? new Date(data.reportedDate).toLocaleDateString() : "",
      resolutionStatus:
        data.resolutionStatus === "resolved"
          ? "Fully Resolved - Machine is working normally"
          : data.resolutionStatus === "partiallyResolved"
            ? "Partially Resolved - Requires additional parts"
            : "Unresolved - Further action required",
    }

    // Get admin email from environment variables or use a default
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"

    // Send email with job card details
    const { data: emailData, error } = await resend.emails.send({
      from: "Job Card System <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `Job Card: ${data.clientCompany} - ${data.machineName}`,
      react: JobCardEmail({ data: formattedData }),
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error("Failed to send email")
    }

    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error("Error submitting job card:", error)
    throw new Error("Failed to submit job card")
  }
}
