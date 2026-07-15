param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$base = Join-Path $RepoRoot "apps/api/src/genesis-runtime-v1"
$files = @(
  "genesis-runtime-v1.types.ts",
  "genesis-runtime-v1.registry.ts",
  "genesis-runtime-v1.service.ts",
  "genesis-runtime-v1.controller.ts",
  "genesis-runtime-v1.module.ts",
  "index.ts"
)
foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) { throw "Missing: $file" }
}
$registry = Get-Content (Join-Path $base "genesis-runtime-v1.registry.ts") -Raw
foreach ($capability in @(
  "DATABASE_GENERATOR",
  "AI_AGENT_GENERATOR",
  "WORKFLOW_GENERATOR",
  "PLUGIN_GENERATOR",
  "SDK_GENERATOR",
  "DOCUMENTATION_GENERATOR",
  "TEST_GENERATOR",
  "RUNTIME_COMMAND_CENTER"
)) {
  if ($registry -notmatch $capability) { throw "Missing capability: $capability" }
}
[pscustomobject]@{ success=$true; system="AVOS Genesis Runtime V1"; verification="passed"; capabilities=8 } | Format-List