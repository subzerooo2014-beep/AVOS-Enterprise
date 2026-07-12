$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-engine-v2-workspace-smoke.cjs"
$WorkspaceRoot = Join-Path $env:TEMP "avos-genesis-v2-workspace-smoke"

Remove-Item $WorkspaceRoot `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue

@'
const { createHash } = require("node:crypto");
const {
  WorkspaceExecutionMode,
  WorkspaceMaterializer,
  WorkspaceIntegrityReporter,
} = require(process.cwd() + "/dist/genesis-engine-v2-workspace");

const workspaceRoot = process.argv[2];

const createArtifact = (relativePath, content, overwrite = false) => ({
  relativePath,
  content,
  overwrite,
  hash: createHash("sha256").update(content).digest("hex"),
});

(async () => {
  const materializer = new WorkspaceMaterializer();
  const reporter = new WorkspaceIntegrityReporter();

  const artifacts = [
    createArtifact(
      "src/identity/identity.service.ts",
      "export class IdentityService {}\n"
    ),
    createArtifact(
      "src/catalog/catalog.service.ts",
      "export class CatalogService {}\n"
    ),
    createArtifact(
      "README.md",
      "# Generated AVOS Workspace\n"
    )
  ];

  const dryRun = await materializer.execute({
    rootDirectory: workspaceRoot,
    artifacts,
    mode: WorkspaceExecutionMode.DRY_RUN,
  });

  const applied = await materializer.execute({
    rootDirectory: workspaceRoot,
    artifacts,
    mode: WorkspaceExecutionMode.APPLY,
  });

  const report = reporter.report(applied);

  if (!dryRun.success || !report.healthy) {
    console.error(JSON.stringify({ dryRun, applied, report }, null, 2));
    process.exit(1);
  }

  const rollback = await materializer.rollback(
    applied.rollbackManifest,
  );

  if (rollback.some((operation) => !operation.success)) {
    console.error(JSON.stringify({ rollback }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({
    success: true,
    system: "AVOS Genesis Engine",
    bundle: "Genesis Engine v2 Workspace Execution",
    version: "2.2.0",
    dryRunStatus: dryRun.status,
    applyStatus: applied.status,
    operations: report.operations,
    created: report.created,
    overwritten: report.overwritten,
    skipped: report.skipped,
    verified: report.verified,
    failed: report.failed,
    rollbackEntries: report.rollbackEntries,
    rollbackOperations: rollback.length,
    healthStatus: "healthy"
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile $WorkspaceRoot

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v2 Workspace smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
    Remove-Item $WorkspaceRoot -Recurse -Force -ErrorAction SilentlyContinue
}
