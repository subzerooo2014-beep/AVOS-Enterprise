param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$module = Get-Content `
  (Join-Path $RepoRoot "apps/api/src/growth-revenue-expansion/growth-revenue-expansion.module.ts") `
  -Raw

$app = Get-Content `
  (Join-Path $RepoRoot "apps/api/src/app.module.ts") `
  -Raw

$checks = @{
  module = $module -match "GrowthRevenueExpansionService"
  export = $module -match "exports:\s*\[GrowthRevenueExpansionService\]"
  registration = $app -match "GrowthRevenueExpansionModule"
  web = Test-Path (
    Join-Path $RepoRoot "apps/web/src/app/growth-revenue-expansion/page.tsx"
  )
  mobile = Test-Path (
    Join-Path $RepoRoot "apps/mobile/lib/features/growth_revenue_expansion/growth_revenue_expansion_screen.dart"
  )
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Growth, Revenue & Market Expansion Platform V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List