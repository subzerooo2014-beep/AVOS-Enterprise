param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$module = Get-Content (Join-Path $RepoRoot "apps/api/src/foundation-mega-bundle/foundation-mega-bundle.module.ts") -Raw
$app = Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw
$checks = @{
  module = $module -match "FoundationMegaBundleService"
  export = $module -match "exports:\s*\[FoundationMegaBundleService\]"
  registration = $app -match "FoundationMegaBundleModule"
  web = Test-Path (Join-Path $RepoRoot "apps/web/src/app/foundation-command-center/page.tsx")
  mobile = Test-Path (Join-Path $RepoRoot "apps/mobile/lib/features/foundation_command_center/foundation_command_center_screen.dart")
}
$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Integration failed: $($failed.Name -join ', ')" }
[pscustomobject]@{
  success = $true
  system = "AVOS Foundation Mega Bundle V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List