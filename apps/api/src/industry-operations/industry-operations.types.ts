export type OperationStatus =
  | "CREATED"
  | "RESERVED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export interface IndustryOperationOrder {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  capabilityKey: string;
  entityId: string;
  quantity: number;
  status: OperationStatus;
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryInventoryItem {
  id: string;
  industryKey: string;
  tenantId: string;
  sku: string;
  entityId: string;
  available: number;
  reserved: number;
  location: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryReservation {
  id: string;
  industryKey: string;
  tenantId: string;
  orderId: string;
  inventoryItemId: string;
  quantity: number;
  expiresAt: string;
  status: "ACTIVE" | "RELEASED" | "CONSUMED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface IndustryFulfillmentTask {
  id: string;
  industryKey: string;
  tenantId: string;
  orderId: string;
  taskType:
    | "PICK"
    | "PACK"
    | "SERVICE"
    | "INSPECTION"
    | "SHIP"
    | "DELIVER"
    | "HANDOVER";
  assigneeId?: string;
  status: OperationStatus;
  dueAt?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustrySlaPolicy {
  id: string;
  industryKey: string;
  capabilityKey: string;
  name: string;
  targetMinutes: number;
  escalationMinutes: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryExceptionRecord {
  id: string;
  industryKey: string;
  tenantId: string;
  orderId?: string;
  taskId?: string;
  code: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface IndustryOperationsDashboard {
  orders: number;
  activeOrders: number;
  inventoryItems: number;
  reservations: number;
  activeReservations: number;
  tasks: number;
  openTasks: number;
  exceptions: number;
  criticalExceptions: number;
  generatedAt: string;
}