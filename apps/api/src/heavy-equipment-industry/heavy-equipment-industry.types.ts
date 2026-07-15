export type EquipmentCategory =
  | "EXCAVATOR"
  | "BULLDOZER"
  | "LOADER"
  | "CRANE"
  | "FORKLIFT"
  | "GRADER"
  | "ROLLER"
  | "DUMP_TRUCK"
  | "CONCRETE_EQUIPMENT"
  | "AGRICULTURAL"
  | "MINING"
  | "POWER_GENERATION"
  | "LIFTING_PLATFORM"
  | "OTHER";

export type EquipmentLifecycleStatus =
  | "DRAFT"
  | "AVAILABLE"
  | "RESERVED"
  | "RENTED"
  | "DEPLOYED"
  | "IN_MAINTENANCE"
  | "OUT_OF_SERVICE"
  | "SOLD"
  | "EXPORTED"
  | "RETIRED";

export type EquipmentCondition =
  | "NEW"
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "REQUIRES_REPAIR";

export interface HeavyEquipmentAsset {
  id: string;
  tenantId: string;
  serialNumber: string;
  fleetNumber: string;
  category: EquipmentCategory;
  manufacturer: string;
  model: string;
  year: number;
  condition: EquipmentCondition;
  lifecycleStatus: EquipmentLifecycleStatus;
  branchId?: string;
  ownerId?: string;
  currentSiteId?: string;
  operatingHours: number;
  odometerKm?: number;
  purchasePrice: number;
  bookValue: number;
  marketValue: number;
  currency: string;
  specifications: Record<string, string | number | boolean>;
  documentIds: string[];
  telematicsDeviceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentSite {
  id: string;
  tenantId: string;
  name: string;
  projectCode: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  managerId?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentDeployment {
  id: string;
  tenantId: string;
  equipmentId: string;
  siteId: string;
  operatorId: string;
  plannedStartAt: string;
  plannedEndAt: string;
  actualStartAt?: string;
  actualEndAt?: string;
  status: "PLANNED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  shiftHours: number;
  purpose: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentInspection {
  id: string;
  tenantId: string;
  equipmentId: string;
  inspectorId: string;
  inspectionType: "PRE_USE" | "PERIODIC" | "SAFETY" | "REGULATORY" | "SALE";
  result: "PASS" | "CONDITIONAL" | "FAIL";
  checklist: Array<{
    item: string;
    passed: boolean;
    note?: string;
  }>;
  defects: string[];
  nextInspectionAt?: string;
  createdAt: string;
}

export interface EquipmentWorkOrder {
  id: string;
  tenantId: string;
  equipmentId: string;
  workshopId: string;
  type: "PREVENTIVE" | "CORRECTIVE" | "BREAKDOWN" | "WARRANTY" | "RECALL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "APPROVED" | "IN_PROGRESS" | "WAITING_PARTS" | "COMPLETED" | "CANCELLED";
  description: string;
  laborCost: number;
  partsCost: number;
  currency: string;
  assignedTechnicianIds: string[];
  openedAt: string;
  completedAt?: string;
  updatedAt: string;
}

export interface EquipmentRentalContract {
  id: string;
  tenantId: string;
  equipmentId: string;
  customerId: string;
  siteId?: string;
  rateType: "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
  rate: number;
  currency: string;
  startAt: string;
  endAt: string;
  includedHours: number;
  deposit: number;
  status: "DRAFT" | "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentListing {
  id: string;
  tenantId: string;
  equipmentId: string;
  sellerId: string;
  listingType: "SALE" | "RENT";
  title: string;
  description: string;
  askingPrice: number;
  currency: string;
  published: boolean;
  featured: boolean;
  exportEligible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SparePartInventoryItem {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  compatibleCategories: EquipmentCategory[];
  warehouseId: string;
  quantityOnHand: number;
  reorderPoint: number;
  unitCost: number;
  currency: string;
  updatedAt: string;
}

export interface EquipmentTelematicsReading {
  id: string;
  tenantId: string;
  equipmentId: string;
  capturedAt: string;
  engineHours: number;
  fuelLevelPercent: number;
  engineTemperatureCelsius: number;
  batteryVoltage: number;
  latitude?: number;
  longitude?: number;
  idleMinutes: number;
  faultCodes: string[];
}

export interface EquipmentAiAssessment {
  id: string;
  tenantId: string;
  equipmentId: string;
  type:
    | "VALUATION"
    | "PREDICTIVE_MAINTENANCE"
    | "UTILIZATION"
    | "FUEL_EFFICIENCY"
    | "SAFETY_RISK"
    | "FRAUD"
    | "DEMAND"
    | "RENTAL_PRICING";
  score: number;
  recommendation: string;
  factors: string[];
  createdAt: string;
}