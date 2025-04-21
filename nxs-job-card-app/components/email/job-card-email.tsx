import { Html, Body, Container, Section, Hr, Text, Heading, Img } from "@react-email/components"

interface JobCardEmailProps {
  data: any
}

export default function JobCardEmail({ data }: JobCardEmailProps) {
  return (
    <Html>
      <Body style={{ fontFamily: "Arial, sans-serif", margin: "0", padding: "0" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #e5e7eb" }}>
          <Heading style={{ textAlign: "center", color: "#111827" }}>Job Card Report</Heading>

          <Section style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "5px" }}>
            <Heading as="h2" style={{ fontSize: "18px", marginBottom: "10px", color: "#4b5563" }}>
              Engineer Details
            </Heading>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Name: {data.engineerName}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>ID: {data.engineerId}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Phone: {data.engineerPhone}</Text>
          </Section>

          <Section style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "5px" }}>
            <Heading as="h2" style={{ fontSize: "18px", marginBottom: "10px", color: "#4b5563" }}>
              Client Details
            </Heading>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Contact Person: {data.clientName}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Company/Institution: {data.clientCompany}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Phone: {data.clientPhone}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Email: {data.clientEmail}</Text>
          </Section>

          <Section style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "5px" }}>
            <Heading as="h2" style={{ fontSize: "18px", marginBottom: "10px", color: "#4b5563" }}>
              Machine Details
            </Heading>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Machine Name: {data.machineName}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Model: {data.machineModel || "N/A"}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Serial Number: {data.machineSerialNumber}</Text>
          </Section>

          <Section style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "5px" }}>
            <Heading as="h2" style={{ fontSize: "18px", marginBottom: "10px", color: "#4b5563" }}>
              Fault Details
            </Heading>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Reported Date: {data.reportedDate}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Description: {data.faultDescription}</Text>
          </Section>

          <Section style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "5px" }}>
            <Heading as="h2" style={{ fontSize: "18px", marginBottom: "10px", color: "#4b5563" }}>
              Final Result
            </Heading>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Status: {data.resolutionStatus}</Text>
            <Text style={{ margin: "5px 0", color: "#374151" }}>Details: {data.resolutionDetails}</Text>
            {data.partsReplaced && (
              <Text style={{ margin: "5px 0", color: "#374151" }}>Parts Replaced: {data.partsReplaced}</Text>
            )}
          </Section>

          <Section style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "5px" }}>
            <Heading as="h2" style={{ fontSize: "18px", marginBottom: "10px", color: "#4b5563" }}>
              Recommendations
            </Heading>
            <Text style={{ margin: "5px 0", color: "#374151" }}>{data.recommendations}</Text>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "20px 0" }} />

          <Section style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            {data.stampImage && (
              <div style={{ width: "48%" }}>
                <Heading as="h3" style={{ fontSize: "16px", marginBottom: "10px", color: "#4b5563" }}>
                  Institution Stamp
                </Heading>
                <Img
                  src={data.stampImage}
                  alt="Institution Stamp"
                  width="100%"
                  style={{ maxHeight: "150px", objectFit: "contain", border: "1px solid #e5e7eb" }}
                />
              </div>
            )}

            {data.signatureImage && (
              <div style={{ width: "48%" }}>
                <Heading as="h3" style={{ fontSize: "16px", marginBottom: "10px", color: "#4b5563" }}>
                  Client Signature
                </Heading>
                <Img
                  src={data.signatureImage}
                  alt="Client Signature"
                  width="100%"
                  style={{ maxHeight: "150px", objectFit: "contain", border: "1px solid #e5e7eb" }}
                />
              </div>
            )}
          </Section>

          <Text style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", marginTop: "20px" }}>
            This job card was generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
