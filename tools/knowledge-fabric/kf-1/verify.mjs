import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const knowledgeRoot = path.join(
  root,
  "apps",
  "api",
  "src",
  "knowledge-fabric",
);

const requiredFiles = [
  "knowledge.types.ts",
  "knowledge.contracts.ts",
  "knowledge-checksum.service.ts",
  "knowledge-validator.service.ts",
  "knowledge-registry.service.ts",
  "knowledge-graph.service.ts",
  "knowledge-foundation.service.ts",
  "knowledge-fabric.controller.ts",
  "knowledge-fabric.module.ts",
  "index.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(knowledgeRoot, file)),
);

if (missing.length) {
  throw new Error(`KF-1 missing files: ${missing.join(", ")}`);
}

const appModule = fs.readFileSync(
  path.join(root, "apps", "api", "src", "app.module.ts"),
  "utf8",
);

if (!appModule.includes("KnowledgeFabricModule")) {
  throw new Error("KnowledgeFabricModule is not registered in AppModule.");
}

const registry = fs.readFileSync(
  path.join(knowledgeRoot, "knowledge-registry.service.ts"),
  "utf8",
);

const requiredRegistryTokens = [
  "register(input: RegisterKnowledgeInput)",
  "update(id: string, input: UpdateKnowledgeInput)",
  "activate(id: string)",
  "deprecate(id: string)",
  "archive(id: string)",
  "snapshot(): KnowledgeRegistrySnapshot",
];

for (const token of requiredRegistryTokens) {
  if (!registry.includes(token)) {
    throw new Error(`KF-1 registry token missing: ${token}`);
  }
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Knowledge Fabric",
      pack: "KF-1 Knowledge Foundation",
      verification: "passed",
      foundationFirst: true,
      filesVerified: requiredFiles.length,
      moduleRegistered: true,
      rollbackReady: fs.existsSync(
        path.join(
          root,
          "tools",
          "knowledge-fabric",
          "kf-1",
          "rollback.ps1",
        ),
      ),
    },
    null,
    2,
  ),
);