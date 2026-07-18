import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/release-deployment-center/page.tsx",
  "src/components/release-deployment-center/release-deployment-center.tsx",
  "src/components/release-deployment-center/release-deployment-center.module.css",
  "src/data/release-deployment-center.ts",
  "src/store/release-deployment-center-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("ReleaseDeploymentCenter"),
  pipelineReady: component.includes("RELEASE PIPELINE"),
  filteringReady: component.includes("visibleReleases"),
  rollbackReady: component.includes("rollbackReady"),
  intelligenceReady: component.includes("AVOS RELEASE INTELLIGENCE"),
  releasesSeeded: (data.match(/id: "REL-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 22",
  version: "3.22.0",
  classification: "enterprise-release-deployment-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
