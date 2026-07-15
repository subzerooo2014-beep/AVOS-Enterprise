import { AvosApplicationDefinition } from "./applications-suite.types";

export const AVOS_APPLICATIONS: AvosApplicationDefinition[] = [
  {
    key: "customer-app",
    name: "Customer App",
    capabilities: ["marketplace", "offers", "bookings", "messages"],
  },
  {
    key: "dealer-app",
    name: "Dealer App",
    capabilities: ["inventory", "leads", "quotes", "sales"],
  },
  {
    key: "workshop-app",
    name: "Workshop App",
    capabilities: ["bookings", "jobs", "parts", "warranty"],
  },
  {
    key: "finance-partner-app",
    name: "Finance Partner App",
    capabilities: ["applications", "approvals", "offers", "settlements"],
  },
  {
    key: "insurance-partner-app",
    name: "Insurance Partner App",
    capabilities: ["quotes", "policies", "claims", "renewals"],
  },
  {
    key: "logistics-app",
    name: "Logistics App",
    capabilities: ["shipments", "tracking", "customs", "delivery"],
  },
  {
    key: "admin-console",
    name: "Admin Console",
    capabilities: ["users", "moderation", "governance", "operations"],
  },
  {
    key: "executive-dashboard",
    name: "Executive Dashboard",
    capabilities: ["kpis", "revenue", "growth", "risk"],
  },
];