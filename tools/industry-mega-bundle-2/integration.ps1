param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$module = Get-Content (Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-2/industry-mega-bundle-2.module.ts") -Raw
$app = Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw

$checks = @{
  module = $module -match "IndustryMegaBundle2Service"
  export = $module -match "exports:\s*\[IndustryMegaBundle2Service\]"
  registration = $app -match "IndustryMegaBundle2Module"
  web = Test-Path (Join-Path $RepoRoot "apps/web/src/app/industry-mega-bundle-2/page.tsx")
  mobile = Test-Path (Join-Path $RepoRoot "apps/mobile/lib/features/industry_mega_bundle_2/industry_mega_bundle_2_screen.dart")
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Integration failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 2"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List