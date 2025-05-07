"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { ServiceFormData } from "@/lib/types"
import { generateServiceReportPDF } from "@/lib/pdf-generator"

export async function submitServiceReport(formData: ServiceFormData) {
  try {
    const supabase = createServerSupabaseClient()

    // First, check if engineer exists, if not create
    const { data: existingEngineer, error: engineerError } = await supabase
      .from("engineers")
      .select("id, employee_id")
      .eq("employee_id", formData.engineerId)
      .single()

    if (engineerError && engineerError.code !== "PGRST116") {
      throw new Error(`Engineer lookup error: ${engineerError.message}`)
    }

    if (!existingEngineer) {
      // Create new engineer
      const { error: createEngineerError } = await supabase.from("engineers").insert({
        name: formData.engineerName,
        employee_id: formData.engineerId,
        phone: formData.engineerPhone,
        email: formData.engineerEmail,
      })

      if (createEngineerError) {
        throw new Error(`Failed to create engineer: ${createEngineerError.message}`)
      }
    } else {
      // Update engineer information
      const { error: updateEngineerError } = await supabase
        .from("engineers")
        .update({
          name: formData.engineerName,
          phone: formData.engineerPhone,
          email: formData.engineerEmail,
        })
        .eq("employee_id", formData.engineerId)

      if (updateEngineerError) {
        throw new Error(`Failed to update engineer: ${updateEngineerError.message}`)
      }
    }

    // Create service record with all the new fields
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .insert({
        // Engineer reference
        employee_id: formData.engineerId,

        // Client information
        client_name: formData.clientName,
        client_address: formData.clientAddress,
        client_phone: formData.clientPhone,
        client_email: formData.clientEmail,
        contact_person: formData.contactPerson || null,
        contact_phone: formData.contactPhone || null,

        // Machine information
        machine_model: formData.machineModel,
        machine_serial: formData.machineSerial,
        installation_date: formData.installDate || null,
        last_service_date: formData.lastService || null,
        machine_category: formData.machineCategory || null,
        machine_location: formData.machineLocation || null,

        // Service information
        problem_reported: formData.problemReported,
        service_done: formData.serviceDone,
        recommendations: formData.recommendations || null,
        service_type: formData.serviceType || null,
        service_category: formData.serviceCategory || null,
        parts_used: formData.partsUsed || null,
        labor_hours: formData.laborHours || null,
        service_cost: formData.serviceCost || null,

        // Status and follow-up
        status: formData.status || "completed",
        requires_follow_up: formData.requiresFollowUp || false,
        follow_up_date: formData.followUpDate || null,
        follow_up_notes: formData.followUpNotes || null,

        // Service agreement
        under_warranty: formData.underWarranty || false,
        contract_number: formData.contractNumber || null,

        // Approval
        approved_by: formData.approvedBy || null,
        approval_date: formData.approvalDate ? new Date(formData.approvalDate).toISOString() : null,
      })
      .select("id")
      .single()

    if (serviceError) {
      throw new Error(`Failed to create service record: ${serviceError.message}`)
    }

    revalidatePath("/")

    return {
      success: true,
      message: "Service report submitted successfully!",
      serviceId: service.id,
    }
  } catch (error) {
    console.error("Error submitting service report:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function getRecentServices(limit = 10) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        engineer:engineers!employee_id(name)
      `)
      .order("service_date", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch recent services: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching recent services:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: [],
    }
  }
}

export async function getServiceById(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        engineer:engineers!employee_id(name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch service: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching service:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null,
    }
  }
}

export async function generatePDF(serviceId: string) {
  try {
    const { success, data: service } = await getServiceById(serviceId)

    if (!success || !service) {
      throw new Error("Service not found")
    }

    const pdfBuffer = generateServiceReportPDF(service)

    return {
      success: true,
      data: pdfBuffer,
      filename: `service-report-${serviceId}.pdf`,
    }
  } catch (error) {
    console.error("Error generating PDF:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
