param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$module = Get-Content (Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-1/industry-mega-bundle-1.module.ts") -Raw
$app = Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw

$checks = @{
  module = $module -match "IndustryMegaBundle1Service"
  export = $module -match "exports:\s*\[IndustryMegaBundle1Service\]"
  registration = $app -match "IndustryMegaBundle1Module"
  web = Test-Path (Join-Path $RepoRoot "apps/web/src/app/industry-mega-bundle-1/page.tsx")
  mobile = Test-Path (Join-Path $RepoRoot "apps/mobile/lib/features/industry_mega_bundle_1/industry_mega_bundle_1_screen.dart")
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Integration failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List