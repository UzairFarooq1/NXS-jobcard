export interface JobCard {
  id: string
  created_at: string

  // Engineer details
  engineer_name: string
  engineer_id: string
  engineer_phone: string

  // Client details
  client_name: string
  client_company: string
  client_phone: string
  client_email: string

  // Machine details
  machine_name: string
  machine_serial_number: string
  machine_model?: string

  // Fault details
  fault_description: string
  reported_date: string

  // Final result
  resolution_status: string
  resolution_details: string
  parts_replaced?: string

  // Recommendations
  recommendations: string

  // Attachments
  stamp_image_url?: string
  signature_image_url?: string

  // Status
  email_sent: boolean
  synced_from_offline: boolean
}

export interface FormValues {
  engineerName: string
  engineerId: string
  engineerPhone: string
  clientName: string
  clientCompany: string
  clientPhone: string
  clientEmail: string
  machineName: string
  machineSerialNumber: string
  machineModel?: string
  faultDescription: string
  reportedDate: Date
  resolutionStatus: "resolved" | "partiallyResolved" | "unresolved"
  resolutionDetails: string
  partsReplaced?: string
  recommendations: string
  stampImage?: string
  signatureImage?: string
  syncedFromOffline?: boolean
}
