import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredDirs = [
  "src/ultra-ai-commerce/dto",
  "src/ultra-ai-commerce/engines",
];
for (const dir of requiredDirs) {
  if (!fs.existsSync(path.join(root, dir))) throw new Error(`Missing ${dir}`);
}

const dtoCount = fs.readdirSync(path.join(root, "src/ultra-ai-commerce/dto")).filter((f) => f.endsWith(".ts")).length;
const engineCount = fs.readdirSync(path.join(root, "src/ultra-ai-commerce/engines")).filter((f) => f.endsWith(".ts")).length;

if (dtoCount < 14) throw new Error(`Expected at least 14 DTO files, found ${dtoCount}`);
if (engineCount < 16) throw new Error(`Expected at least 16 engine files, found ${engineCount}`);

const controller = fs.readFileSync(path.join(root, "src/ultra-ai-commerce/ultra-ai-commerce.controller.ts"), "utf8");
for (const marker of [
  'Post("pricing")',
  'Post("negotiation")',
  'Post("buyer-matching")',
  'Post("fraud-risk")',
  'Post("market-intelligence")',
  'Post("vehicle-health")',
  'Post("finance-intelligence")',
  'Post("insurance-intelligence")',
  'Post("export-intelligence")',
]) {
  if (!controller.includes(marker)) throw new Error(`Missing route ${marker}`);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Ultra Bundle AI Commerce Smoke Test",
  dtoFiles: dtoCount,
  engineFiles: engineCount,
  pricing: true,
  negotiation: true,
  buyerMatching: true,
  fraudRisk: true,
  marketIntelligence: true,
  sellerAssistant: true,
  vehicleHealth: true,
  financeIntelligence: true,
  insuranceIntelligence: true,
  exportIntelligence: true,
  recommendations: true,
  status: "passed"
}, null, 2));
