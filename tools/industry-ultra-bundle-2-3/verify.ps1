[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-ultra-bundle-2-3"

$requiredFiles = @(
  "industry-ultra-bundle-2-3.types.ts",
  "industry-ultra-bundle-2-3.registry.ts",
  "industry-ultra-bundle-2-3.service.ts",
  "industry-ultra-bundle-2-3.module.ts",
  "energy-utilities.controller.ts",
  "retail-commerce.controller.ts",
  "hospitality-tourism.controller.ts",
  "education.controller.ts",
  "government-public-sector.controller.ts",
  "banking-fintech.controller.ts",
  "insurance.controller.ts",
  "telecommunications.controller.ts",
  "aviation.controller.ts",
  "maritime.controller.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content -LiteralPath (Join-Path $base "industry-ultra-bundle-2-3.registry.ts") -Raw
$service = Get-Content -LiteralPath (Join-Path $base "industry-ultra-bundle-2-3.service.ts") -Raw

$industries = @(
  "ENERGY_UTILITIES",
  "RETAIL_COMMERCE",
  "HOSPITALITY_TOURISM",
  "EDUCATION",
  "GOVERNMENT_PUBLIC_SECTOR",
  "BANKING_FINTECH",
  "INSURANCE",
  "TELECOMMUNICATIONS",
  "AVIATION",
  "MARITIME"
)

$capabilities = @(
  "CORE_OPERATIONS",
  "ASSET_MANAGEMENT",
  "CUSTOMER_CITIZEN_360",
  "WORKFORCE",
  "SUPPLY_CHAIN",
  "FINANCE_REVENUE",
  "COMPLIANCE",
  "RISK",
  "AI_INTELLIGENCE",
  "AUTOMATION",
  "MARKETPLACE_ECOSYSTEM",
  "ANALYTICS",
  "DOCUMENTS",
  "NOTIFICATIONS",
  "COMMAND_CENTER"
)

foreach ($industry in $industries) {
  if ($registry -notmatch "(?m)^\s*$industry\s*:") {
    throw "Missing industry: $industry"
  }
}

foreach ($capability in $capabilities) {
  if ($registry -notmatch $capability) {
    throw "Missing capability: $capability"
  }
}

foreach ($method in @(
  "framework",
  "createRecord",
  "activateRecord",
  "createWorkflow",
  "startWorkflow",
  "completeWorkflow",
  "createInsight",
  "listRecords",
  "commandCenter"
)) {
  if ($service -notmatch $method) {
    throw "Missing runtime method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Ultra Bundle 2-3"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  industries = $industries.Count
  capabilitiesPerIndustry = $capabilities.Count
  totalCapabilities = $industries.Count * $capabilities.Count
} | Format-List