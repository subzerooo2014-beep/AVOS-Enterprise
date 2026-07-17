import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "apps/api/src/architecture-intelligence-engine");
const folders = ["registry","observatory","quality","compatibility","evolution","risk","recommendation","governance","certification"];
const prefixes = ["ArchitectureRegistry","ArchitectureObservatory","ArchitectureQuality","ArchitectureCompatibility","ArchitectureEvolution","ArchitectureRisk","ArchitectureRecommendation","ArchitectureGovernance","ArchitectureCertification"];

const files = folders.flatMap((folder) => [
  folder + "/" + folder + ".types.ts",
  folder + "/" + folder + ".service.ts",
  folder + "/" + folder + ".controller.ts",
  folder + "/" + folder + ".module.ts",
  folder + "/index.ts",
]);
files.push("architecture-intelligence-engine.module.ts", "index.ts");

const missing = files.filter((file) => !fs.existsSync(path.join(base, file)));
const rootModule = fs.readFileSync(path.join(base, "architecture-intelligence-engine.module.ts"), "utf8");
const appModule = fs.readFileSync(path.join(root, "apps/api/src/app.module.ts"), "utf8");
const modulesRegistered = prefixes.every((prefix) => rootModule.includes(prefix + "Module"));
const appRegistered = appModule.includes("ArchitectureIntelligenceEngineModule");

const report = {
  success: missing.length === 0 && modulesRegistered && appRegistered,
  system: "AVOS Architecture Intelligence Engine",
  verification: missing.length === 0 && modulesRegistered && appRegistered ? "passed" : "failed",
  filesVerified: files.length,
  missing,
  modulesRegistered,
  appRegistered,
};

console.log(JSON.stringify(report, null, 2));
if (!report.success) process.exit(1);