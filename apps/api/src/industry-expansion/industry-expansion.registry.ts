import { IndustryVertical } from "./industry-expansion.types";

export const INDUSTRY_VERTICALS: IndustryVertical[] = [
  {
    key: "cars",
    name: "Cars",
    capabilities: ["new", "used", "certified", "leasing"],
    active: true,
  },
  {
    key: "motorcycles",
    name: "Motorcycles",
    capabilities: ["street", "sport", "touring", "off-road"],
    active: true,
  },
  {
    key: "trucks",
    name: "Trucks",
    capabilities: ["light", "medium", "heavy", "commercial"],
    active: true,
  },
  {
    key: "heavy-equipment",
    name: "Heavy Equipment",
    capabilities: ["construction", "industrial", "agriculture", "rental"],
    active: true,
  },
  {
    key: "boats-yachts",
    name: "Boats & Yachts",
    capabilities: ["boats", "yachts", "marine-services", "berths"],
    active: true,
  },
  {
    key: "aircraft",
    name: "Aircraft",
    capabilities: ["private", "commercial", "parts", "services"],
    active: true,
  },
  {
    key: "number-plates",
    name: "Number Plates",
    capabilities: ["special", "auction", "valuation", "transfer"],
    active: true,
  },
  {
    key: "accessories-parts",
    name: "Accessories & Parts",
    capabilities: ["oem", "aftermarket", "performance", "electronics"],
    active: true,
  },
  {
    key: "classic-vehicles",
    name: "Classic Vehicles",
    capabilities: ["classic", "collectible", "restoration", "valuation"],
    active: true,
  },
  {
    key: "caravans-campers",
    name: "Caravans & Campers",
    capabilities: ["caravans", "campers", "motorhomes", "accessories"],
    active: true,
  },
  {
    key: "fleet-mobility",
    name: "Fleet & Mobility",
    capabilities: ["fleet", "rental", "subscription", "corporate"],
    active: true,
  },
  {
    key: "export-only",
    name: "Export Only",
    capabilities: ["export-listings", "shipping", "customs", "documents"],
    active: true,
  }
];