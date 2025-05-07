import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { ServiceRecord } from "./types"

// Function to generate a PDF from a service record
export function generateServiceReportPDF(service: ServiceRecord): Uint8Array {
  // Create a new PDF document
  const doc = new jsPDF()

  // Add company logo/header
  doc.setFontSize(20)
  doc.setTextColor(0, 51, 102)
  doc.text("Service Engineer Report", 105, 15, { align: "center" })

  // Add report ID and date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Report ID: ${service.id}`, 195, 10, { align: "right" })
  doc.text(`Date: ${new Date(service.service_date).toLocaleDateString()}`, 195, 15, { align: "right" })

  // Add status
  if (service.status) {
    const statusColors = {
      completed: [0, 128, 0],
      pending: [255, 165, 0],
      in_progress: [0, 0, 255],
      on_hold: [128, 128, 128],
      cancelled: [255, 0, 0],
    }

    const color = statusColors[service.status] || [0, 0, 0]
    doc.setTextColor(color[0], color[1], color[2])
    doc.text(`Status: ${service.status.toUpperCase()}`, 195, 20, { align: "right" })
  }

  doc.setTextColor(0, 0, 0)

  // Engineer Information
  doc.setFontSize(12)
  doc.setTextColor(0, 51, 102)
  doc.text("Engineer Information", 14, 30)
  doc.setDrawColor(0, 51, 102)
  doc.line(14, 32, 195, 32)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  autoTable(doc, {
    startY: 35,
    head: [["Name", "Employee ID"]],
    body: [[service.engineer?.name || "", service.employee_id]],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
  })

  // Client Information
  doc.setFontSize(12)
  doc.setTextColor(0, 51, 102)
  let yPos = doc.lastAutoTable.finalY + 10
  doc.text("Client Information", 14, yPos)
  doc.setDrawColor(0, 51, 102)
  doc.line(14, yPos + 2, 195, yPos + 2)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  autoTable(doc, {
    startY: yPos + 5,
    head: [["Client Name", "Contact Person", "Phone", "Email"]],
    body: [[service.client_name, service.contact_person || "N/A", service.client_phone, service.client_email]],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
  })

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 2,
    head: [["Address"]],
    body: [[service.client_address]],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
  })

  // Machine Information
  doc.setFontSize(12)
  doc.setTextColor(0, 51, 102)
  yPos = doc.lastAutoTable.finalY + 10
  doc.text("Machine Information", 14, yPos)
  doc.setDrawColor(0, 51, 102)
  doc.line(14, yPos + 2, 195, yPos + 2)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)

  // Add warranty badge if applicable
  if (service.under_warranty) {
    doc.setFillColor(200, 230, 200)
    doc.roundedRect(150, yPos - 5, 45, 10, 2, 2, "F")
    doc.setTextColor(0, 100, 0)
    doc.text("Under Warranty", 172.5, yPos, { align: "center" })
    doc.setTextColor(0, 0, 0)
  }

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Model", "Serial Number", "Category", "Location"]],
    body: [
      [
        service.machine_model,
        service.machine_serial,
        service.machine_category || "N/A",
        service.machine_location || "N/A",
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
  })

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 2,
    head: [["Installation Date", "Last Service Date", "Contract/Warranty Number"]],
    body: [
      [
        service.installation_date ? new Date(service.installation_date).toLocaleDateString() : "N/A",
        service.last_service_date ? new Date(service.last_service_date).toLocaleDateString() : "N/A",
        service.contract_number || "N/A",
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
  })

  // Service Details
  doc.setFontSize(12)
  doc.setTextColor(0, 51, 102)
  yPos = doc.lastAutoTable.finalY + 10
  doc.text("Service Details", 14, yPos)
  doc.setDrawColor(0, 51, 102)
  doc.line(14, yPos + 2, 195, yPos + 2)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)

  // Service type and category
  if (service.service_type || service.service_category) {
    autoTable(doc, {
      startY: yPos + 5,
      head: [["Service Type", "Service Category", "Labor Hours", "Service Cost"]],
      body: [
        [
          service.service_type || "N/A",
          service.service_category || "N/A",
          service.labor_hours ? `${service.labor_hours} hrs` : "N/A",
          service.service_cost ? `$${service.service_cost.toFixed(2)}` : "N/A",
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      margin: { left: 14, right: 14 },
    })
  }

  // Problem reported
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [["Problem Reported"]],
    body: [[service.problem_reported]],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
  })

  // Service performed
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 2,
    head: [["Service Performed"]],
    body: [[service.service_done]],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
  })

  // Parts used
  if (service.parts_used) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      head: [["Parts Used"]],
      body: [[service.parts_used]],
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      margin: { left: 14, right: 14 },
    })
  }

  // Recommendations
  if (service.recommendations) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      head: [["Recommendations"]],
      body: [[service.recommendations]],
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      margin: { left: 14, right: 14 },
    })
  }

  // Follow-up Information
  if (service.requires_follow_up) {
    doc.setFontSize(12)
    doc.setTextColor(0, 51, 102)
    yPos = doc.lastAutoTable.finalY + 10
    doc.text("Follow-up Information", 14, yPos)
    doc.setDrawColor(0, 51, 102)
    doc.line(14, yPos + 2, 195, yPos + 2)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)

    autoTable(doc, {
      startY: yPos + 5,
      head: [["Follow-up Required", "Follow-up Date"]],
      body: [["Yes", service.follow_up_date ? new Date(service.follow_up_date).toLocaleDateString() : "Not specified"]],
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      margin: { left: 14, right: 14 },
    })

    if (service.follow_up_notes) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 2,
        head: [["Follow-up Notes"]],
        body: [[service.follow_up_notes]],
        theme: "grid",
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
        margin: { left: 14, right: 14 },
      })
    }
  }

  // Approval Information
  if (service.approved_by) {
    doc.setFontSize(12)
    doc.setTextColor(0, 51, 102)
    yPos = doc.lastAutoTable.finalY + 10
    doc.text("Approval Information", 14, yPos)
    doc.setDrawColor(0, 51, 102)
    doc.line(14, yPos + 2, 195, yPos + 2)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)

    autoTable(doc, {
      startY: yPos + 5,
      head: [["Approved By", "Approval Date"]],
      body: [
        [service.approved_by, service.approval_date ? new Date(service.approval_date).toLocaleDateString() : "N/A"],
      ],
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      margin: { left: 14, right: 14 },
    })
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Service Report - Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`, 105, 285, {
      align: "center",
    })
  }

  // Return the PDF as a Uint8Array
  return doc.output("arraybuffer")
}
