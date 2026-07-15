param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/global-enterprise-platform"
$files = @(
  "global-enterprise-platform.types.ts",
  "global-enterprise-platform.registry.ts",
  "global-enterprise-platform.service.ts",
  "global-enterprise-platform.controller.ts",
  "global-enterprise-platform.module.ts",
  "index.ts"
)

foreach ($f in $files) {
  if (-not (Test-Path (Join-Path $base $f))) { throw "Missing: $f" }
}

$r = Get-Content (Join-Path $base "global-enterprise-platform.registry.ts") -Raw
$s = Get-Content (Join-Path $base "global-enterprise-platform.service.ts") -Raw

$checks = @{
  tenantFederation = $r -match "TENANT_FEDERATION"
  masterData = $r -match "MASTER_DATA_HUB"
  customer360 = $r -match "CUSTOMER_360"
  assetRegistry = $r -match "ASSET_REGISTRY"
  identity = $r -match "IDENTITY_ACCESS"
  workflow = $r -match "WORKFLOW_HUB"
  ai = $r -match "AI_ORCHESTRATOR"
  billing = $r -match "BILLING_ORCHESTRATOR"
  multiRegion = $r -match "MULTI_REGION_DEPLOYMENT"
  disasterRecovery = $r -match "DISASTER_RECOVERY"
  observability = $r -match "OBSERVABILITY"
  commandCenter = $r -match "ENTERPRISE_COMMAND_CENTER"
  runtimeRegistration = $s -match "registerEntry"
  runtimeExecution = $s -match "execute"
  runtimeHealth = $s -match "updateHealth"
  runtimeCommandCenter = $s -match "commandCenter"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Verification failed: $($failed.Name -join ', ')" }

$capabilityCount = ([regex]::Matches($r, '^[ ]{2}[A-Z_]+:\s*\{', "Multiline")).Count
if ($capabilityCount -lt 30) {
  throw "Expected at least 30 capabilities, found $capabilityCount"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Global Enterprise Platform Pack V1"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  capabilities = $capabilityCount
} | Format-List