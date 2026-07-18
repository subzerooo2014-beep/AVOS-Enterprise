import {
  readFileSync,
} from "node:fs";

const vehiclesSource = readFileSync(
  new URL("../src/data/vehicles.ts", import.meta.url),
  "utf8",
);

const vehicleCount = (
  vehiclesSource.match(/id: "veh-/g) ?? []
).length;

const checks = {
  eightVehiclesPresent: vehicleCount === 8,
  featuredVehiclesPresent:
    vehiclesSource.includes("featured: true"),
  verifiedVehiclesPresent:
    vehiclesSource.includes("verified: true"),
  electricVehiclePresent:
    vehiclesSource.includes('fuel: "electric"'),
  multipleCitiesPresent:
    vehiclesSource.includes('city: "دبي"') &&
    vehiclesSource.includes('city: "أبوظبي"'),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack: "Vehicle Marketplace Core - Mega Pack 2",
    version: "1.2.0",
    stage: "completed",
    vehicles: vehicleCount,
    qualityScore: success ? 100 : 0,
    checks,
  }),
);

if (!success) {
  process.exit(1);
}
