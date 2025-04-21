import { type NextRequest, NextResponse } from "next/server"
import { generateJobCardPDF } from "@/lib/actions"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return new NextResponse("Job card ID is required", { status: 400 })
    }

    const pdfBuffer = await generateJobCardPDF(id)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="jobcard-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return new NextResponse("Error generating PDF", { status: 500 })
  }
}
