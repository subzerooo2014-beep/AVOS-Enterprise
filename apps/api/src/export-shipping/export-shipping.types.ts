export type ExportStatus =
  | "DRAFT"
  | "DOCUMENTS_PENDING"
  | "READY_FOR_CUSTOMS"
  | "CUSTOMS_REVIEW"
  | "CLEARED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface ExportCase {
  id: string;
  tenantId: string;
  industryKey: string;
  orderId: string;
  sellerId: string;
  buyerId: string;
  originCountry: string;
  destinationCountry: string;
  destinationPort?: string;
  status: ExportStatus;
  exportOnly: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingQuote {
  id: string;
  exportCaseId: string;
  carrierId: string;
  serviceLevel: "ECONOMY" | "STANDARD" | "EXPRESS";
  amount: number;
  currency: string;
  estimatedDays: number;
  validUntil: string;
  status: "QUOTED" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface ExportDocument {
  id: string;
  exportCaseId: string;
  documentType:
    | "INVOICE"
    | "PACKING_LIST"
    | "CERTIFICATE_OF_ORIGIN"
    | "EXPORT_DECLARATION"
    | "INSPECTION_CERTIFICATE"
    | "INSURANCE_CERTIFICATE"
    | "BILL_OF_LADING";
  reference: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomsCheck {
  id: string;
  exportCaseId: string;
  authority: string;
  status: "PENDING" | "PASS" | "FAIL" | "REVIEW";
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  exportCaseId: string;
  carrierId: string;
  quoteId: string;
  trackingNumber: string;
  status:
    | "CREATED"
    | "PICKUP_SCHEDULED"
    | "IN_TRANSIT"
    | "AT_PORT"
    | "CUSTOMS"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "EXCEPTION";
  events: Array<{
    id: string;
    status: string;
    location: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface LogisticsException {
  id: string;
  exportCaseId: string;
  shipmentId?: string;
  code: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}