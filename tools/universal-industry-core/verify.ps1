[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/universal-industry-core"

$requiredFiles = @(
  "universal-industry-core.types.ts",
  "universal-industry-core.registry.ts",
  "universal-industry-core.service.ts",
  "universal-industry-core.controller.ts",
  "universal-industry-core.module.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content -LiteralPath (Join-Path $base "universal-industry-core.registry.ts") -Raw
$service = Get-Content -LiteralPath (Join-Path $base "universal-industry-core.service.ts") -Raw

$capabilities = @(
  "INDUSTRY_ENGINE",
  "INDUSTRY_REGISTRY",
  "INDUSTRY_RUNTIME",
  "WORKFLOW_ENGINE",
  "AI_INTELLIGENCE",
  "ASSET_ENGINE",
  "FINANCE_ENGINE",
  "COMPLIANCE_ENGINE",
  "RISK_ENGINE",
  "ANALYTICS_ENGINE",
  "COMMAND_CENTER",
  "DASHBOARD_ENGINE",
  "NOTIFICATION_ENGINE",
  "AUTOMATION_ENGINE",
  "REPORT_ENGINE",
  "KPI_ENGINE",
  "DOCUMENT_ENGINE",
  "INTEGRATION_ENGINE",
  "PLUGIN_SDK",
  "TEMPLATE_ENGINE"
)

foreach ($capability in $capabilities) {
  if ($registry -notmatch "(?m)^\s*$capability\s*:") {
    throw "Missing capability: $capability"
  }
}

$methods = @(
  "framework",
  "registerIndustry",
  "activateIndustry",
  "provisionRuntime",
  "activateRuntime",
  "createWorkflow",
  "activateWorkflow",
  "registerAsset",
  "recordFinancialEntry",
  "registerRisk",
  "createInsight",
  "recordKpi",
  "registerDocument",
  "registerPlugin",
  "publishTemplate",
  "listIndustries",
  "commandCenter"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) {
    throw "Missing runtime method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Universal Industry Core V1"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  capabilities = $capabilities.Count
  runtimeMethods = $methods.Count
} | Format-List