"use client";

import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { submitServiceReport } from "./actions";
import { ServiceFormData } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServiceForm() {
  const [activeTab, setActiveTab] = useState("engineer");

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    error: false,
    message: "",
  });

  const [formData, setFormData] = useState<ServiceFormData>({
    // Engineer details
    engineerName: "",
    engineerId: "",
    engineerPhone: "",
    engineerEmail: "",

    // Client details
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
    contactPerson: "",
    contactPhone: "",

    // Machine details
    machineModel: "",
    machineSerial: "",
    installDate: "",
    lastService: "",
    machineCategory: "",
    machineLocation: "",

    // Service details
    problemReported: "",
    serviceDone: "",
    recommendations: "",
    serviceType: "",
    serviceCategory: "",
    partsUsed: "",
    laborHours: 0,
    serviceCost: 0,

    // Status and follow-up
    status: "completed",
    requiresFollowUp: false,
    followUpDate: "",
    followUpNotes: "",

    // Service agreement
    underWarranty: false,
    contractNumber: "",

    // Approval
    approvedBy: "",
    approvalDate: "",
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateTab = (tab: string) => {
    switch (tab) {
      case "engineer":
        return (
          formData.engineerName.trim() !== "" &&
          formData.engineerId.trim() !== "" &&
          formData.engineerPhone.trim() !== "" &&
          formData.engineerEmail.trim() !== ""
        );
      case "client":
        return (
          formData.clientName.trim() !== "" &&
          formData.clientAddress.trim() !== "" &&
          formData.clientPhone.trim() !== "" &&
          formData.clientEmail.trim() !== ""
        );
      case "machine":
        return (
          formData.machineModel.trim() !== "" &&
          formData.machineSerial.trim() !== ""
        );
      case "service":
        return (
          formData.problemReported.trim() !== "" &&
          formData.serviceDone.trim() !== ""
        );
      default:
        return true;
    }
  };

  const handleTabChange = (
    currentTab: string,
    nextTab: SetStateAction<string>
  ) => {
    if (nextTab === "submit") {
      handleSubmit();
      return;
    }

    // If moving forward, validate the current tab
    if (
      ["engineer", "client", "machine"].includes(currentTab) &&
      ["client", "machine", "service", "additional"].includes(nextTab) &&
      !validateTab(currentTab)
    ) {
      setStatus({
        submitted: false,
        submitting: false,
        error: true,
        message: `Please fill in all required fields in the ${currentTab} section before proceeding.`,
      });
      return;
    }

    // Clear any error messages when changing tabs
    if (status.error) {
      setStatus({
        submitted: false,
        submitting: false,
        error: false,
        message: "",
      });
    }

    // Change the tab using state
    setActiveTab(nextTab);
  };

  const handleSubmit = async () => {
    // Validate all tabs before submission
    if (
      !validateTab("engineer") ||
      !validateTab("client") ||
      !validateTab("machine") ||
      !validateTab("service")
    ) {
      setStatus({
        submitted: false,
        submitting: false,
        error: true,
        message: "Please fill in all required fields before submitting.",
      });
      return;
    }

    setStatus({
      submitted: false,
      submitting: true,
      error: false,
      message: "",
    });

    try {
      const result = await submitServiceReport(formData);

      if (result.success) {
        setStatus({
          submitted: true,
          submitting: false,
          error: false,
          message: result.message,
        });
        // Reset form after successful submission
        setFormData({
          engineerName: "",
          engineerId: "",
          engineerPhone: "",
          engineerEmail: "",
          clientName: "",
          clientAddress: "",
          clientPhone: "",
          clientEmail: "",
          contactPerson: "",
          contactPhone: "",
          machineModel: "",
          machineSerial: "",
          installDate: "",
          lastService: "",
          machineCategory: "",
          machineLocation: "",
          problemReported: "",
          serviceDone: "",
          recommendations: "",
          serviceType: "",
          serviceCategory: "",
          partsUsed: "",
          laborHours: 0,
          serviceCost: 0,
          status: "completed",
          requiresFollowUp: false,
          followUpDate: "",
          followUpNotes: "",
          underWarranty: false,
          contractNumber: "",
          approvedBy: "",
          approvalDate: "",
        });
        setActiveTab("engineer");
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        error: true,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Service Engineer Report
      </h1>

      {status.submitted ? (
        <Alert className="max-w-3xl mx-auto mb-8">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your service report has been submitted successfully.
          </AlertDescription>
          <Button
            className="mt-4"
            onClick={() => setStatus({ ...status, submitted: false })}
          >
            Submit Another Report
          </Button>
        </Alert>
      ) : status.error ? (
        <Alert variant="destructive" className="max-w-3xl mx-auto mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {status.message ||
              "There was an error submitting your report. Please try again."}
          </AlertDescription>
        </Alert>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="max-w-3xl mx-auto"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="engineer">Engineer</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="machine">Machine</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="engineer">
            <Card>
              <CardHeader>
                <CardTitle>Service Engineer Details</CardTitle>
                <CardDescription>
                  Enter your personal and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineerName">Full Name</Label>
                    <Input
                      id="engineerName"
                      value={formData.engineerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineerId">Employee ID</Label>
                    <Input
                      id="engineerId"
                      value={formData.engineerId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineerPhone">Phone Number</Label>
                    <Input
                      id="engineerPhone"
                      type="tel"
                      value={formData.engineerPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineerEmail">Email</Label>
                    <Input
                      id="engineerEmail"
                      type="email"
                      value={formData.engineerEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => handleTabChange("engineer", "client")}
                >
                  Next: Client Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="client">
            <Card>
              <CardHeader>
                <CardTitle>Client Details</CardTitle>
                <CardDescription>
                  Enter the client's information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client/Hospital Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAddress">Address</Label>
                  <Textarea
                    id="clientAddress"
                    value={formData.clientAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Phone Number</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={formData.clientPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTabChange("client", "engineer")}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => handleTabChange("client", "machine")}
                >
                  Next: Machine Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="machine">
            <Card>
              <CardHeader>
                <CardTitle>Machine Details</CardTitle>
                <CardDescription>
                  Enter information about the serviced machine.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="machineModel">Model/Type</Label>
                    <Input
                      id="machineModel"
                      value={formData.machineModel}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineSerial">Serial Number</Label>
                    <Input
                      id="machineSerial"
                      value={formData.machineSerial}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="machineCategory">Category</Label>
                    <Select
                      value={formData.machineCategory}
                      onValueChange={(value) =>
                        handleSelectChange("machineCategory", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diagnostic">
                          Diagnostic Equipment
                        </SelectItem>
                        <SelectItem value="surgical">
                          Surgical Equipment
                        </SelectItem>
                        <SelectItem value="monitoring">
                          Monitoring Equipment
                        </SelectItem>
                        <SelectItem value="laboratory">
                          Laboratory Equipment
                        </SelectItem>
                        <SelectItem value="imaging">
                          Imaging Equipment
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineLocation">Location</Label>
                    <Input
                      id="machineLocation"
                      value={formData.machineLocation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="installDate">Installation Date</Label>
                    <Input
                      id="installDate"
                      type="date"
                      value={formData.installDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastService">Last Service Date</Label>
                    <Input
                      id="lastService"
                      type="date"
                      value={formData.lastService}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="underWarranty"
                    checked={formData.underWarranty}
                    onCheckedChange={(checked) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        underWarranty: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="underWarranty">Under Warranty</Label>
                </div>
                {formData.underWarranty && (
                  <div className="space-y-2">
                    <Label htmlFor="contractNumber">
                      Contract/Warranty Number
                    </Label>
                    <Input
                      id="contractNumber"
                      value={formData.contractNumber}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTabChange("machine", "client")}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => handleTabChange("machine", "service")}
                >
                  Next: Service Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
                <CardDescription>
                  Describe the problem, service performed, and recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) =>
                        handleSelectChange("serviceType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="installation">
                          Installation
                        </SelectItem>
                        <SelectItem value="preventive">
                          Preventive Maintenance
                        </SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="calibration">Calibration</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceCategory">Service Category</Label>
                    <Select
                      value={formData.serviceCategory}
                      onValueChange={(value) =>
                        handleSelectChange("serviceCategory", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="warranty">Warranty</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="billable">Billable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problemReported">Problem Reported</Label>
                  <Textarea
                    id="problemReported"
                    value={formData.problemReported}
                    onChange={handleChange}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceDone">Service Performed</Label>
                  <Textarea
                    id="serviceDone"
                    value={formData.serviceDone}
                    onChange={handleChange}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partsUsed">Parts Used</Label>
                  <Textarea
                    id="partsUsed"
                    value={formData.partsUsed}
                    onChange={handleChange}
                    placeholder="List any parts used during service"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="laborHours">Labor Hours</Label>
                    <Input
                      id="laborHours"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.laborHours}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          laborHours: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceCost">Service Cost</Label>
                    <Input
                      id="serviceCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.serviceCost}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          serviceCost: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    value={formData.recommendations}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTabChange("service", "machine")}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => handleTabChange("service", "additional")}
                >
                  Next: Additional Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="additional">
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  Status, follow-up, and approval information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requiresFollowUp"
                      checked={formData.requiresFollowUp}
                      onCheckedChange={(checked) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          requiresFollowUp: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="requiresFollowUp">Requires Follow-up</Label>
                  </div>

                  {formData.requiresFollowUp && (
                    <div className="space-y-2 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="followUpDate">Follow-up Date</Label>
                        <Input
                          id="followUpDate"
                          type="date"
                          value={formData.followUpDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="followUpNotes">Follow-up Notes</Label>
                        <Textarea
                          id="followUpNotes"
                          value={formData.followUpNotes}
                          onChange={handleChange}
                          placeholder="Notes for follow-up"
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvedBy">Approved By</Label>
                  <Input
                    id="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalDate">Approval Date</Label>
                  <Input
                    id="approvalDate"
                    type="date"
                    value={formData.approvalDate}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTabChange("additional", "service")}
                >
                  Previous
                </Button>
                <Button type="submit" disabled={status.submitting}>
                  {status.submitting ? "Submitting..." : "Submit Report"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
