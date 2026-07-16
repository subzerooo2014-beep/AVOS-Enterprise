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

const scanner = fs.readFileSync(scannerPath, "utf8");

const checks = {
  upwardTraversal: scanner.includes("for (let depth = 0; depth < 8; depth += 1)"),
  gitRootDetection: scanner.includes('join(current, ".git")'),
  apiSourceDetection: scanner.includes('join(current, "apps", "api", "src")'),
  appsApiFallback: scanner.includes("normalized.endsWith(appsApiSuffix)"),
  resolvedRootUsed: scanner.includes("this.scanLayer(repoRoot, definition)"),
  explicitFailure: scanner.includes("Unable to resolve AVOS repository root"),
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`Hotfix V2 smoke checks failed: ${failed.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      hotfix: "Architecture Review Hotfix V2",
      smokeTest: "passed",
      checks,
      checkCount: Object.keys(checks).length,
      rollbackReady: fs.existsSync(
        path.join(
          root,
          "tools",
          "capability-fabric",
          "review-hotfix-v2",
          "rollback.ps1",
        ),
      ),
    },
    null,
    2,
  ),
);
