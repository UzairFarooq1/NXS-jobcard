import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text, Img } from "@react-email/components"

interface JobCardEmailProps {
  data: any
}

export default function JobCardEmail({ data }: JobCardEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Job Card: {data.clientCompany} - {data.machineName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Job Card Report</Heading>

          <Section style={section}>
            <Heading style={h2}>Engineer Details</Heading>
            <Text style={text}>Name: {data.engineerName}</Text>
            <Text style={text}>ID: {data.engineerId}</Text>
            <Text style={text}>Phone: {data.engineerPhone}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Client Details</Heading>
            <Text style={text}>Contact Person: {data.clientName}</Text>
            <Text style={text}>Company/Institution: {data.clientCompany}</Text>
            <Text style={text}>Phone: {data.clientPhone}</Text>
            <Text style={text}>Email: {data.clientEmail}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Machine Details</Heading>
            <Text style={text}>Machine Name: {data.machineName}</Text>
            <Text style={text}>Serial Number: {data.machineSerialNumber}</Text>
            {data.machineModel && <Text style={text}>Model: {data.machineModel}</Text>}
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Fault Details</Heading>
            <Text style={text}>Date Reported: {data.reportedDate}</Text>
            <Text style={text}>Description: {data.faultDescription}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Resolution</Heading>
            <Text style={text}>Status: {data.resolutionStatus}</Text>
            <Text style={text}>Details: {data.resolutionDetails}</Text>
            {data.partsReplaced && <Text style={text}>Parts Replaced: {data.partsReplaced}</Text>}
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Recommendations</Heading>
            <Text style={text}>{data.recommendations}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Attachments</Heading>
            {data.stampImage && (
              <Section>
                <Heading style={h3}>Institution Stamp</Heading>
                <Img src={data.stampImage} alt="Institution Stamp" width="300" height="auto" style={image} />
              </Section>
            )}

            {data.signatureImage && (
              <Section>
                <Heading style={h3}>Client Signature</Heading>
                <Img src={data.signatureImage} alt="Client Signature" width="300" height="auto" style={image} />
              </Section>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This job card was submitted on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "15px 0",
  padding: "0",
}

const h3 = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "10px 0",
  padding: "0",
}

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "5px 0",
}

const section = {
  margin: "15px 0",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const image = {
  border: "1px solid #e6ebf1",
  borderRadius: "4px",
  marginTop: "10px",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "20px",
  textAlign: "center" as const,
}
