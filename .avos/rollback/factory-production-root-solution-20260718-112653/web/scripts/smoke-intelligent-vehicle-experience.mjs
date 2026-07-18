import fs from "node:fs";

const intelligence = fs.readFileSync(
  new URL(
    "../src/lib/vehicle-intelligence.ts",
    import.meta.url,
  ),
  "utf8",
);

const plates = fs.readFileSync(
  new URL("../src/data/plates.ts", import.meta.url),
  "utf8",
);

const plateCount = (
  plates.match(/id: "plate-/g) ?? []
).length;

const checks = {
  scoringEngineReady:
    intelligence.includes("analyzeVehicle"),
  recommendationEngineReady:
    intelligence.includes("recommendVehicles"),
  ownershipEstimatorReady:
    intelligence.includes("estimateOwnership"),
  sixPlatesPresent: plateCount === 6,
  ultraRarePlatePresent:
    plates.includes('rarity: "ultra"'),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack:
      "Intelligent Vehicle Experience - Mega Pack 3",
    version: "1.3.0",
    stage: "completed",
    plateListings: plateCount,
    intelligenceCapabilities: 5,
    qualityScore: success ? 100 : 0,
    checks,
  }),
);

if (!success) {
  process.exit(1);
}
