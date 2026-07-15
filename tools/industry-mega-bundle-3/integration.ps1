param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$module = Get-Content (Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-3/industry-mega-bundle-3.module.ts") -Raw
$app = Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw

$checks = @{
  module = $module -match "IndustryMegaBundle3Service"
  export = $module -match "exports:\s*\[IndustryMegaBundle3Service\]"
  registration = $app -match "IndustryMegaBundle3Module"
  web = Test-Path (Join-Path $RepoRoot "apps/web/src/app/industry-mega-bundle-3/page.tsx")
  mobile = Test-Path (Join-Path $RepoRoot "apps/mobile/lib/features/industry_mega_bundle_3/industry_mega_bundle_3_screen.dart")
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Integration failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 3"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List