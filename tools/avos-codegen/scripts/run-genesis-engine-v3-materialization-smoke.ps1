$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v3-materialization-smoke.cjs"
$WorkspaceRoot = Join-Path $env:TEMP "avos-genesis-v3-materialization-workspace"

Remove-Item $WorkspaceRoot `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue

@'
const { createHash } = require("node:crypto");
const {
  GenesisV3SystemMaterializer,
  GenesisV3MaterializationRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v3-materialization");

const root = process.argv[2];

const artifact = (relativePath, content) => ({
  relativePath,
  content,
  overwrite: true,
  hash: createHash("sha256").update(content).digest("hex"),
});

(async () => {
  const materializer = new GenesisV3SystemMaterializer();

  const result = await materializer.execute({
    rootDirectory: root,
    artifacts: [
      artifact(
        "package.json",
        JSON.stringify({
          name: "avos-v3-generated-system",
          private: true
        }, null, 2) + "\n"
      ),
      artifact(
        "apps/api/prisma/schema.prisma",
        "generator client {\n  provider = \"prisma-client-js\"\n}\n"
      ),
      artifact(
        "README.md",
        "# AVOS Genesis v3 Generated System\n"
      ),
      artifact(
        "apps/api/src/customers/customers.service.ts",
        "export class CustomersService {}\n"
      )
    ]
  });

  const health =
    new GenesisV3MaterializationRuntimeVerifier().verify(result);

  if (!health.healthy) {
    console.error(JSON.stringify({ result, health }, null, 2));
    process.exit(1);
  }

  const rollback = await materializer.rollback(
    root,
    result.rollbackEntries,
  );

  if (rollback.some((operation) => !operation.success)) {
    console.error(JSON.stringify({ rollback }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({
    success: true,
    system: "AVOS Genesis Engine",
    bundle: "Genesis Engine v3 Materialization & Build Readiness",
    version: "3.1.0",
    status: health.status,
    buildReadinessScore: health.buildReadinessScore,
    operations: health.operations,
    created: health.created,
    overwritten: health.overwritten,
    skipped: health.skipped,
    verified: health.verified,
    failed: health.failed,
    rollbackEntries: health.rollbackEntries,
    rollbackOperations: rollback.length,
    directories: health.directories,
    bootstrapCommands: health.bootstrapCommands,
    healthStatus: "healthy"
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
'@ | Set-Content `
    -Path $SmokeFile `
    -Encoding UTF8

try {
    node $SmokeFile $WorkspaceRoot

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v3 Materialization smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
    Remove-Item $WorkspaceRoot -Recurse -Force -ErrorAction SilentlyContinue
}
