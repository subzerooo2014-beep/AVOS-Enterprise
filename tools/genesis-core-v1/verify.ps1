param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$base = Join-Path $RepoRoot "apps/api/src/genesis-core-v1"
$files = @(
  "genesis-core-v1.types.ts",
  "genesis-core-v1.registry.ts",
  "genesis-core-v1.service.ts",
  "genesis-core-v1.controller.ts",
  "genesis-core-v1.module.ts",
  "index.ts"
)
foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) { throw "Missing: $file" }
}
$registry = Get-Content (Join-Path $base "genesis-core-v1.registry.ts") -Raw
foreach ($capability in @(
  "GENESIS_ORCHESTRATOR",
  "BLUEPRINT_COMPILER",
  "SYSTEM_GENERATOR",
  "DOMAIN_GENERATOR",
  "API_GENERATOR",
  "WEB_GENERATOR",
  "MOBILE_GENERATOR",
  "GENESIS_COMMAND_CENTER"
)) {
  if ($registry -notmatch $capability) { throw "Missing capability: $capability" }
}
[pscustomobject]@{ success=$true; system="AVOS Genesis Core V1"; verification="passed"; capabilities=8 } | Format-List