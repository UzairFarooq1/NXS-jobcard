"use server"

import { put } from "@vercel/blob"
import nodemailer from "nodemailer"
import { renderAsync } from "@react-email/render"
import JobCardEmailTemplate from "@/components/email/job-card-template"
import { createServerClient } from "./supabase"
import { generatePDF } from "./pdf-generator"

// Create a nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // This is an app password, not your regular Gmail password
  },
})

export async function uploadImage(base64Image: string, fileName: string) {
  try {
    // Convert base64 to blob
    const base64Data = base64Image.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")

    // Create a blob from the buffer
    const blob = new Blob([buffer])
    const file = new File([blob], fileName, { type: "image/jpeg" })

    // Upload to Vercel Blob
    const { url } = await put(fileName, file, {
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
    const supabase = createServerClient()

    // Upload images if they exist and are base64 strings
    let stampImageUrl = data.stampImage
    let signatureImageUrl = data.signatureImage

    if (data.stampImage && data.stampImage.startsWith("data:image")) {
      stampImageUrl = await uploadImage(data.stampImage, `stamp-${Date.now()}.jpg`)
    }

    if (data.signatureImage && data.signatureImage.startsWith("data:image")) {
      signatureImageUrl = await uploadImage(data.signatureImage, `signature-${Date.now()}.jpg`)
    }

    // Format the data for database
    const jobCardData = {
      engineer_name: data.engineerName,
      engineer_id: data.engineerId,
      engineer_phone: data.engineerPhone,
      client_name: data.clientName,
      client_company: data.clientCompany,
      client_phone: data.clientPhone,
      client_email: data.clientEmail,
      machine_name: data.machineName,
      machine_serial_number: data.machineSerialNumber,
      machine_model: data.machineModel,
      fault_description: data.faultDescription,
      reported_date: new Date(data.reportedDate).toISOString().split("T")[0],
      resolution_status: data.resolutionStatus,
      resolution_details: data.resolutionDetails,
      parts_replaced: data.partsReplaced,
      recommendations: data.recommendations,
      stamp_image_url: stampImageUrl,
      signature_image_url: signatureImageUrl,
      synced_from_offline: data.syncedFromOffline || false,
    }

    // Insert into Supabase
    const { data: insertedData, error } = await supabase.from("job_cards").insert(jobCardData).select()

    if (error) {
      console.error("Error inserting job card:", error)
      throw new Error("Failed to save job card to database")
    }

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
      stampImage: stampImageUrl,
      signatureImage: signatureImageUrl,
    }

    // Admin email address
    const adminEmail = "uzair.farooq@nxsltd.com"

    // Render the React email template to HTML
    const emailHtml = await renderAsync(JobCardEmailTemplate({ data: formattedData }))

    // Generate PDF
    const pdfBuffer = await generatePDF(formattedData)

    // Send email with job card details
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: adminEmail,
      subject: `Job Card: ${data.clientCompany} - ${data.machineName}`,
      html: emailHtml,
      attachments: [
        {
          filename: `jobcard-${Date.now()}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    })

    // Update the job card to mark email as sent
    await supabase.from("job_cards").update({ email_sent: true }).eq("id", insertedData[0].id)

    console.log("Email sent successfully:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
      jobCardId: insertedData[0].id,
      pdfAvailable: true,
    }
  } catch (error) {
    console.error("Error submitting job card:", error)
    throw new Error("Failed to submit job card")
  }
}

export async function getJobCardById(id: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("job_cards").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching job card:", error)
      throw new Error("Failed to fetch job card")
    }

    return data
  } catch (error) {
    console.error("Error in getJobCardById:", error)
    throw error
  }
}

export async function generateJobCardPDF(id: string) {
  try {
    // Get the job card data
    const jobCardData = await getJobCardById(id)

    if (!jobCardData) {
      throw new Error("Job card not found")
    }

    // Format the data for PDF
    const formattedData = {
      engineerName: jobCardData.engineer_name,
      engineerId: jobCardData.engineer_id,
      engineerPhone: jobCardData.engineer_phone,
      clientName: jobCardData.client_name,
      clientCompany: jobCardData.client_company,
      clientPhone: jobCardData.client_phone,
      clientEmail: jobCardData.client_email,
      machineName: jobCardData.machine_name,
      machineSerialNumber: jobCardData.machine_serial_number,
      machineModel: jobCardData.machine_model,
      faultDescription: jobCardData.fault_description,
      reportedDate: new Date(jobCardData.reported_date).toLocaleDateString(),
      resolutionStatus:
        jobCardData.resolution_status === "resolved"
          ? "Fully Resolved - Machine is working normally"
          : jobCardData.resolution_status === "partiallyResolved"
            ? "Partially Resolved - Requires additional parts"
            : "Unresolved - Further action required",
      resolutionDetails: jobCardData.resolution_details,
      partsReplaced: jobCardData.parts_replaced,
      recommendations: jobCardData.recommendations,
      stampImage: jobCardData.stamp_image_url,
      signatureImage: jobCardData.signature_image_url,
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(formattedData)

    return pdfBuffer
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
