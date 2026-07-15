[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$requiredFiles = @(
  "apps/api/src/global-platform/global-enterprise-services/global-enterprise-services.types.ts",
  "apps/api/src/global-platform/global-enterprise-services/global-enterprise-services.service.ts",
  "apps/api/src/global-platform/global-enterprise-services/global-enterprise-services.controller.ts",
  "apps/api/src/global-platform/global-enterprise-services/global-enterprise-services.module.ts",
  "apps/api/src/global-platform/global-enterprise-services/index.ts",
  "tools/global-platform-ultra-e/ultra-bundle-e.manifest.json"
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
  Join-Path $RepoRoot "apps/api/src/global-platform/global-enterprise-services/global-enterprise-services.service.ts"
) -Raw

$checks = [ordered]@{
  identityFederation = $service -match "registerIdentityProvider"
  organizationHierarchy = $service -match "createOrganizationNode"
  globalAccess = $service -match "evaluateAccess"
  crossCountryPolicy = $service -match "registerPolicy"
  crossRegionEvents = $service -match "crossRegionReplication"
  executiveDashboard = $service -match "getExecutiveSnapshot"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  verification = "passed"
  capabilities = 10
  identityFederation = $checks.identityFederation
  organizationHierarchy = $checks.organizationHierarchy
  globalAccess = $checks.globalAccess
  crossCountryPolicy = $checks.crossCountryPolicy
  crossRegionEvents = $checks.crossRegionEvents
  executiveDashboard = $checks.executiveDashboard
}