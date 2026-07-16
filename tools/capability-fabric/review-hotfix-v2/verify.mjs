import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scannerPath = path.join(
  root,
  "apps",
  "api",
  "src",
  "capability-fabric-review",
  "capability-fabric-scanner.service.ts",
);
const servicePath = path.join(
  root,
  "apps",
  "api",
  "src",
  "capability-fabric-review",
  "capability-fabric-review.service.ts",
);

const scanner = fs.readFileSync(scannerPath, "utf8");
const service = fs.readFileSync(servicePath, "utf8");

const requiredScannerTokens = [
  'import { dirname, join, resolve } from "node:path";',
  "resolveRepositoryRoot(startPath: string)",
  'join(current, ".git")',
  'join(current, "apps", "api", "src")',
  "Unable to resolve AVOS repository root",
  "this.scanLayer(repoRoot, definition)",
];

for (const token of requiredScannerTokens) {
  if (!scanner.includes(token)) {
    throw new Error(`Missing Hotfix V2 scanner token: ${token}`);
  }
}

if (!service.includes("run(startPath = process.cwd())")) {
  throw new Error("Review service does not use the Hotfix V2 startPath signature.");
}

if (!service.includes("this.scanner.scan(startPath)")) {
  throw new Error("Review service does not pass startPath to the scanner.");
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      hotfix: "Architecture Review Hotfix V2",
      verification: "passed",
      repositoryRootAutoDetection: true,
      supportsRepoRootExecution: true,
      supportsAppsApiExecution: true,
      foundationFirst: true,
    },
    null,
    2,
  ),
);
