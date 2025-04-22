import PDFDocument from "pdfkit"

export async function generatePDF(data: any) {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({ margin: 50 })

      // Collect the PDF data chunks
      const chunks: Buffer[] = []
      doc.on("data", (chunk: Buffer<ArrayBufferLike>) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))
      doc.on("error", (err: any) => reject(err))

      // Add company logo or title
      doc.fontSize(25).text("Job Card Report", { align: "center" })
      doc.moveDown()

      // Add date
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" })
      doc.moveDown()

      // Helper function for sections
      const addSection = (title: string, content: Record<string, any>) => {
        doc.fontSize(14).text(title, { underline: true })
        doc.moveDown(0.5)

        Object.entries(content).forEach(([key, value]) => {
          if (value) {
            doc.fontSize(10).text(`${key}: ${value}`)
          }
        })

        doc.moveDown()
      }

      // Add engineer details
      addSection("Engineer Details", {
        Name: data.engineerName,
        ID: data.engineerId,
        Phone: data.engineerPhone,
      })

      // Add client details
      addSection("Client Details", {
        "Contact Person": data.clientName,
        "Company/Institution": data.clientCompany,
        Phone: data.clientPhone,
        Email: data.clientEmail,
      })

      // Add machine details
      addSection("Machine Details", {
        "Machine Name": data.machineName,
        "Serial Number": data.machineSerialNumber,
        Model: data.machineModel || "N/A",
      })

      // Add fault details
      addSection("Fault Details", {
        "Reported Date": data.reportedDate,
        Description: data.faultDescription,
      })

      // Add resolution details
      addSection("Final Result", {
        Status: data.resolutionStatus,
        Details: data.resolutionDetails || "N/A",
        "Parts Replaced": data.partsReplaced || "None",
      })

      // Add recommendations
      addSection("Recommendations", {
        Recommendations: data.recommendations,
      })

      // Finalize the PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
