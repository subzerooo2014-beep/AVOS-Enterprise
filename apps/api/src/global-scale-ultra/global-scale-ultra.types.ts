export type GlobalScaleCapability =
  | "GLOBAL_EXPANSION" | "REGIONAL_OPERATIONS" | "MULTI_REGION_ORCHESTRATION"
  | "COUNTRY_LAUNCH_FACTORY" | "LOCALIZATION_OPERATIONS"
  | "CURRENCY_TAX_CONFIGURATION" | "REGULATORY_LOCALIZATION"
  | "PARTNER_ECOSYSTEM" | "STRATEGIC_ALLIANCES" | "FRANCHISE_NETWORK"
  | "DISTRIBUTOR_NETWORK" | "SUPPLIER_NETWORK" | "GLOBAL_VENDOR_MANAGEMENT"
  | "CROSS_BORDER_COMMERCE" | "GLOBAL_PAYMENTS" | "GLOBAL_BILLING"
  | "GLOBAL_IDENTITY" | "DATA_RESIDENCY" | "SOVEREIGN_CLOUD"
  | "GLOBAL_COMPLIANCE" | "BUSINESS_CONTINUITY" | "ENTERPRISE_RESILIENCE"
  | "DISASTER_RECOVERY" | "GLOBAL_FAILOVER" | "CAPACITY_PLANNING"
  | "RESOURCE_OPTIMIZATION" | "SUSTAINABILITY" | "ESG_INTELLIGENCE"
  | "GLOBAL_OPERATIONS_CENTER" | "GLOBAL_SCALE_COMMAND_CENTER";

export interface GlobalScaleProgram {
  id:string; tenantId:string; capability:GlobalScaleCapability; code:string;
  name:string; owner:string; region:string; country:string; budget:number;
  currency:string; riskScore:number; readinessScore:number;
  status:"DRAFT"|"ACTIVE"|"PAUSED"|"COMPLETED"|"CANCELLED";
  createdAt:string; updatedAt:string;
}
export interface GlobalScaleMilestone {
  id:string; programId:string; name:string; sequence:number; targetDate:string;
  status:"PLANNED"|"ACTIVE"|"COMPLETED"|"BLOCKED"; evidence:string[];
  createdAt:string; updatedAt:string;
}
export interface GlobalScaleRisk {
  id:string; programId:string; riskType:string;
  severity:"LOW"|"MEDIUM"|"HIGH"|"CRITICAL"; probability:number; impact:number;
  mitigation:string; status:"OPEN"|"MITIGATING"|"CLOSED";
  createdAt:string; updatedAt:string;
}