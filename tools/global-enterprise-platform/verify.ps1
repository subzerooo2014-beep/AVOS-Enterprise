[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
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

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content `
  (Join-Path $base "global-enterprise-platform.registry.ts") `
  -Raw

$service = Get-Content `
  (Join-Path $base "global-enterprise-platform.service.ts") `
  -Raw

$requiredCapabilities = @(
  "TENANT_FEDERATION",
  "MASTER_DATA_HUB",
  "CUSTOMER_360",
  "ASSET_REGISTRY",
  "IDENTITY_ACCESS",
  "WORKFLOW_HUB",
  "AI_ORCHESTRATOR",
  "NOTIFICATION_CENTER",
  "DOCUMENT_CENTER",
  "SEARCH_ENGINE",
  "ANALYTICS_BI",
  "AUDIT_COMPLIANCE",
  "CROSS_INDUSTRY_REPORTING",
  "INTEGRATION_HUB",
  "PUBLIC_API_GATEWAY",
  "EVENT_STREAMING",
  "ENTERPRISE_SCHEDULER",
  "AUTOMATION_CENTER",
  "CONFIGURATION_CENTER",
  "FEATURE_FLAGS",
  "PLUGIN_MARKETPLACE",
  "LICENSE_SUBSCRIPTION",
  "BILLING_ORCHESTRATOR",
  "MULTI_REGION_DEPLOYMENT",
  "DISASTER_RECOVERY",
  "BACKUP_RESTORE",
  "OBSERVABILITY",
  "ENTERPRISE_HEALTH",
  "AI_GOVERNANCE",
  "ENTERPRISE_COMMAND_CENTER"
)

$missing = @(
  $requiredCapabilities |
    Where-Object {
      $registry -notmatch "(?m)^\s*$([regex]::Escape($_))\s*:"
    }
)

if ($missing.Count -gt 0) {
  throw "Missing capabilities: $($missing -join ', ')"
}

foreach ($method in @(
  "registerEntry",
  "activateEntry",
  "execute",
  "updateHealth",
  "commandCenter"
)) {
  if ($service -notmatch $method) {
    throw "Missing runtime method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Global Enterprise Platform Pack V1"
  verification = "passed"
  requiredFiles = $files.Count
  capabilities = $requiredCapabilities.Count
} | Format-List