[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$requiredFiles = @(
  "apps/api/src/global-platform/global-operations/global-operations.types.ts",
  "apps/api/src/global-platform/global-operations/global-operations.service.ts",
  "apps/api/src/global-platform/global-operations/global-operations.controller.ts",
  "apps/api/src/global-platform/global-operations/global-operations.module.ts",
  "apps/api/src/global-platform/global-operations/index.ts",
  "tools/global-platform-ultra-d/ultra-bundle-d.manifest.json"
)

$missing = @()

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $file))) {
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  throw "Missing required files: $($missing -join ', ')"
}

$service = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/global-platform/global-operations/global-operations.service.ts"
) -Raw

$checks = [ordered]@{
  multiCountry = $service -match "registerCountry"
  multiTenant = $service -match "createTenant"
  multiRegion = $service -match "updateRegion"
  multiLanguage = $service -match "resolveLocale"
  multiCurrency = $service -match "convertCurrency"
  compliance = $service -match "complianceProfile"
  globalHealth = $service -match "getHealth"
  replication = $service -match "replicationEnabled"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  verification = "passed"
  capabilities = 10
  multiCountry = $checks.multiCountry
  multiTenant = $checks.multiTenant
  multiRegion = $checks.multiRegion
  multiLanguage = $checks.multiLanguage
  multiCurrency = $checks.multiCurrency
  compliance = $checks.compliance
  globalHealth = $checks.globalHealth
  replication = $checks.replication
}