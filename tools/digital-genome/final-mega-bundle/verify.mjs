import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "apps/api/src/digital-genome");
const folders = ["registry","composition","capabilities","products","knowledge","security","integrations","intelligence","health","evolution","certification"];
const prefixes = ["DigitalGenomeRegistry","DigitalGenomeComposition","DigitalGenomeCapabilities","DigitalGenomeProducts","DigitalGenomeKnowledge","DigitalGenomeSecurity","DigitalGenomeIntegrations","DigitalGenomeIntelligence","DigitalGenomeHealth","DigitalGenomeEvolution","DigitalGenomeCertification"];

const files = folders.flatMap((folder) => [
  folder + "/" + folder + ".types.ts",
  folder + "/" + folder + ".service.ts",
  folder + "/" + folder + ".controller.ts",
  folder + "/" + folder + ".module.ts",
  folder + "/index.ts",
]);

files.push("digital-genome.module.ts", "index.ts");

const missing = files.filter((file) => !fs.existsSync(path.join(base, file)));
const rootModule = fs.readFileSync(path.join(base, "digital-genome.module.ts"), "utf8");
const appModule = fs.readFileSync(path.join(root, "apps/api/src/app.module.ts"), "utf8");
const modulesRegistered = prefixes.every((prefix) => rootModule.includes(prefix + "Module"));
const appRegistered = appModule.includes("DigitalGenomeModule");

const report = {
  success: missing.length === 0 && modulesRegistered && appRegistered,
  system: "AVOS Digital Genome",
  verification: missing.length === 0 && modulesRegistered && appRegistered ? "passed" : "failed",
  filesVerified: files.length,
  missing,
  modulesRegistered,
  appRegistered,
};

console.log(JSON.stringify(report, null, 2));

if (!report.success) {
  process.exit(1);
}