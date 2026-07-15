param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$base = Join-Path $RepoRoot "apps/api/src/genesis-enterprise-v1"
$files = @(
  "genesis-enterprise-v1.types.ts",
  "genesis-enterprise-v1.registry.ts",
  "genesis-enterprise-v1.service.ts",
  "genesis-enterprise-v1.controller.ts",
  "genesis-enterprise-v1.module.ts",
  "index.ts"
)
foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) { throw "Missing: $file" }
}
$registry = Get-Content (Join-Path $base "genesis-enterprise-v1.registry.ts") -Raw
foreach ($capability in @(
  "DEPLOYMENT_GENERATOR",
  "INFRASTRUCTURE_GENERATOR",
  "VALIDATION_ENGINE",
  "QUALITY_GATE",
  "RELEASE_MANAGER",
  "ROLLBACK_MANAGER",
  "VERSION_MANAGER",
  "KNOWLEDGE_REGISTRATION",
  "ENTERPRISE_BRAIN_INTEGRATION",
  "EVOLUTION_CENTER_INTEGRATION",
  "MARKETPLACE_PUBLISHER",
  "GLOBAL_COMMAND_CENTER"
)) {
  if ($registry -notmatch $capability) { throw "Missing capability: $capability" }
}
[pscustomobject]@{ success=$true; system="AVOS Genesis Enterprise V1"; verification="passed"; capabilities=12 } | Format-List