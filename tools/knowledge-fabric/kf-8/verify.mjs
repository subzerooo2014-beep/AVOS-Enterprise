import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "apps/api/src/knowledge-fabric/mesh");
const files = [
  "knowledge-mesh.types.ts",
  "knowledge-mesh.contracts.ts",
  "knowledge-mesh-registry.service.ts",
  "knowledge-mesh-routing.service.ts",
  "knowledge-mesh-policy.service.ts",
  "knowledge-mesh-consistency.service.ts",
  "knowledge-mesh-event.service.ts",
  "knowledge-mesh-observability.service.ts",
  "knowledge-mesh-runtime.service.ts",
  "knowledge-mesh-health.service.ts",
  "knowledge-mesh.controller.ts",
  "knowledge-mesh.module.ts",
  "index.ts",
];
const missing = files.filter((file) => !fs.existsSync(path.join(base, file)));
const moduleText = fs.readFileSync(path.join(root, "apps/api/src/knowledge-fabric/knowledge-fabric.module.ts"), "utf8");
const indexText = fs.readFileSync(path.join(root, "apps/api/src/knowledge-fabric/index.ts"), "utf8");
const report = {
  success: missing.length === 0 && moduleText.includes("KnowledgeMeshModule") && indexText.includes('./mesh'),
  system: "AVOS Knowledge Fabric",
  pack: "KF-8 Knowledge Mesh",
  verification: missing.length === 0 ? "passed" : "failed",
  filesVerified: files.length,
  missing,
  moduleRegistered: moduleText.includes("KnowledgeMeshModule"),
  indexRegistered: indexText.includes('./mesh'),
  rollbackReady: fs.existsSync(path.join(root, "tools/knowledge-fabric/kf-8/rollback.ps1")),
};
console.log(JSON.stringify(report, null, 2));
if (!report.success) process.exit(1);