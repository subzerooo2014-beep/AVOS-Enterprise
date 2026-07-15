import {
  SpecializedCapability,
  SpecializedIndustryCode,
} from "./industry-ultra-bundle-4-5.types";

const capabilities: SpecializedCapability[] = [
  "CORE_OPERATIONS",
  "ASSET_RESOURCE_MANAGEMENT",
  "CUSTOMER_BENEFICIARY_360",
  "WORKFORCE_VOLUNTEERS",
  "SUPPLY_CHAIN",
  "FINANCE_FUNDING",
  "COMPLIANCE_SAFETY",
  "RISK_RESILIENCE",
  "AI_INTELLIGENCE",
  "AUTOMATION",
  "ECOSYSTEM_MARKETPLACE",
  "ANALYTICS_IMPACT",
  "DOCUMENTS_CASES",
  "NOTIFICATIONS_RESPONSE",
  "COMMAND_CENTER",
];

export const SPECIALIZED_INDUSTRY_REGISTRY: Record<
  SpecializedIndustryCode,
  { name: string; capabilities: SpecializedCapability[] }
> = {
  AGRICULTURE_AGRITECH: {
    name: "Agriculture & AgriTech Industry Pack",
    capabilities: [...capabilities],
  },
  FOOD_BEVERAGE: {
    name: "Food & Beverage Industry Pack",
    capabilities: [...capabilities],
  },
  MINING_RESOURCES: {
    name: "Mining & Resources Industry Pack",
    capabilities: [...capabilities],
  },
  MEDIA_ENTERTAINMENT: {
    name: "Media & Entertainment Industry Pack",
    capabilities: [...capabilities],
  },
  SPORTS_EVENTS: {
    name: "Sports & Events Industry Pack",
    capabilities: [...capabilities],
  },
  LEGAL_PROFESSIONAL_SERVICES: {
    name: "Legal & Professional Services Industry Pack",
    capabilities: [...capabilities],
  },
  SECURITY_EMERGENCY_SERVICES: {
    name: "Security & Emergency Services Industry Pack",
    capabilities: [...capabilities],
  },
  ENVIRONMENT_WASTE: {
    name: "Environment & Waste Management Industry Pack",
    capabilities: [...capabilities],
  },
  SPACE_SATELLITE: {
    name: "Space & Satellite Industry Pack",
    capabilities: [...capabilities],
  },
  NONPROFIT_HUMANITARIAN: {
    name: "Nonprofit & Humanitarian Industry Pack",
    capabilities: [...capabilities],
  },
};