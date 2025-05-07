import { getServiceById } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

export default async function ServiceDetail({
  params,
}: {
  params: { id: string };
}) {
  const { success, data: service, message } = await getServiceById(params.id);

  if (!success || !service) {
    return notFound();
  }

  const getStatusBadge = (
    status:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<unknown, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | Promise<
          | string
          | number
          | bigint
          | boolean
          | ReactPortal
          | ReactElement<unknown, string | JSXElementConstructor<any>>
          | Iterable<ReactNode>
          | null
          | undefined
        >
      | null
      | undefined
  ) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            In Progress
          </Badge>
        );
      case "on_hold":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            On Hold
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Service Report Details</h1>
          <p className="text-muted-foreground">
            {new Date(service.service_date).toLocaleDateString()} -{" "}
            {service.client_name}
          </p>
        </div>
        <div>{service.status && getStatusBadge(service.status)}</div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Engineer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{service.engineer?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Employee ID
              </p>
              <p>{service.employee_id}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{service.client_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{service.client_email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{service.client_phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p>{service.client_address}</p>
            </div>
            {service.contact_person && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contact Person
                </p>
                <p>{service.contact_person}</p>
              </div>
            )}
            {service.contact_phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contact Phone
                </p>
                <p>{service.contact_phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Machine Information</CardTitle>
            {service.under_warranty && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Under Warranty
              </Badge>
            )}
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Model</p>
              <p>{service.machine_model}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Serial Number
              </p>
              <p>{service.machine_serial}</p>
            </div>
            {service.machine_category && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p>{service.machine_category}</p>
              </div>
            )}
            {service.machine_location && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Location
                </p>
                <p>{service.machine_location}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Installation Date
              </p>
              <p>
                {service.installation_date
                  ? new Date(service.installation_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Service Date
              </p>
              <p>
                {service.last_service_date
                  ? new Date(service.last_service_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            {service.contract_number && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contract/Warranty Number
                </p>
                <p>{service.contract_number}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {service.service_type && <span>{service.service_type}</span>}
              {service.service_category && (
                <span>({service.service_category})</span>
              )}
              {service.labor_hours && (
                <span className="ml-auto">{service.labor_hours} hours</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Problem Reported
              </h3>
              <p className="whitespace-pre-line">{service.problem_reported}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Service Performed
              </h3>
              <p className="whitespace-pre-line">{service.service_done}</p>
            </div>
            {service.parts_used && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Parts Used
                </h3>
                <p className="whitespace-pre-line">{service.parts_used}</p>
              </div>
            )}
            {service.recommendations && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Recommendations
                </h3>
                <p className="whitespace-pre-line">{service.recommendations}</p>
              </div>
            )}
            {service.service_cost > 0 && (
              <div className="pt-2 border-t">
                <h3 className="text-sm font-medium mb-1">Service Cost</h3>
                <p>${service.service_cost.toFixed(2)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {service.requires_follow_up && (
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Follow-up Required
              </CardTitle>
              {service.follow_up_date && (
                <CardDescription>
                  Due by:{" "}
                  {new Date(service.follow_up_date).toLocaleDateString()}
                </CardDescription>
              )}
            </CardHeader>
            {service.follow_up_notes && (
              <CardContent>
                <p className="whitespace-pre-line">{service.follow_up_notes}</p>
              </CardContent>
            )}
          </Card>
        )}

        {service.approved_by && (
          <Card>
            <CardHeader>
              <CardTitle>Approval Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approved By
                </p>
                <p>{service.approved_by}</p>
              </div>
              {service.approval_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Approval Date
                  </p>
                  <p>{new Date(service.approval_date).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
