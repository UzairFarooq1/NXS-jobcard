export type Engineer = {
    id?: string
    name: string
    employee_id: string
    phone: string
    email: string
  }
  
  export type ServiceFormData = {
    // Engineer details
    engineerName: string
    engineerId: string
    engineerPhone: string
    engineerEmail: string
  
    // Client details
    clientName: string
    clientAddress: string
    clientPhone: string
    clientEmail: string
    contactPerson: string
    contactPhone: string
  
    // Machine details
    machineModel: string
    machineSerial: string
    installDate: string
    lastService: string
    machineCategory: string
    machineLocation: string
  
    // Service details
    problemReported: string
    serviceDone: string
    recommendations: string
    serviceType: string
    serviceCategory: string
    partsUsed: string
    laborHours: number
    serviceCost: number
  
    // Status and follow-up
    status: string
    requiresFollowUp: boolean
    followUpDate: string
    followUpNotes: string
  
    // Service agreement
    underWarranty: boolean
    contractNumber: string
  
    // Approval
    approvedBy: string
    approvalDate: string
  }
  
  export type ServiceRecord = {
    id: string
    employee_id: string
  
    // Client information
    client_name: string
    client_address: string
    client_phone: string
    client_email: string
    contact_person: string
    contact_phone: string
  
    // Machine information
    machine_model: string
    machine_serial: string
    installation_date?: string
    last_service_date?: string
    machine_category?: string
    machine_location?: string
  
    // Service information
    problem_reported: string
    service_done: string
    recommendations?: string
    service_type?: string
    service_category?: string
    parts_used?: string
    labor_hours?: number
    service_cost?: number
  
    // Status and follow-up
    status?: string
    requires_follow_up?: boolean
    follow_up_date?: string
    follow_up_notes?: string
  
    // Service agreement
    under_warranty?: boolean
    contract_number?: string
  
    // Approval
    approved_by?: string
    approval_date?: string
  
    // Timestamps
    service_date: string
    created_at: string
    updated_at: string
  
    // Relations
    engineer?: {
      name: string
    }
  }
  