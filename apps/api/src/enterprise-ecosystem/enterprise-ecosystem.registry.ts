import { EcosystemHubDefinition } from "./enterprise-ecosystem.types";

export const ENTERPRISE_ECOSYSTEM_HUBS: EcosystemHubDefinition[] = [
  {
    key: "banking-hub",
    name: "Banking Hub",
    capabilities: ["applications", "offers", "approvals", "settlements"],
  },
  {
    key: "insurance-hub",
    name: "Insurance Hub",
    capabilities: ["quotes", "policies", "claims", "renewals"],
  },
  {
    key: "export-logistics-hub",
    name: "Export & Logistics Hub",
    capabilities: ["shipments", "tracking", "customs", "delivery"],
  },
  {
    key: "government-services-gateway",
    name: "Government Services Gateway",
    capabilities: ["registrations", "permits", "fees", "verification"],
  },
  {
    key: "dealer-network",
    name: "Dealer Network",
    capabilities: ["inventory", "leads", "sales", "performance"],
  },
  {
    key: "workshop-network",
    name: "Workshop Network",
    capabilities: ["bookings", "jobs", "parts", "warranty"],
  },
  {
    key: "fleet-management",
    name: "Fleet Management",
    capabilities: ["vehicles", "drivers", "maintenance", "utilization"],
  },
  {
    key: "auctions-hub",
    name: "Auctions Hub",
    capabilities: ["auctions", "bids", "settlement", "compliance"],
  },
  {
    key: "ai-partner-marketplace",
    name: "AI Partner Marketplace",
    capabilities: ["agents", "plugins", "blueprints", "ratings"],
  },
  {
    key: "enterprise-integrations",
    name: "Enterprise Integrations",
    capabilities: ["connectors", "webhooks", "sync", "monitoring"],
  }
];