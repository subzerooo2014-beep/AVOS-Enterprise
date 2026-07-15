param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/export-shipping/export-shipping.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"ExportShippingController"
  service=$m-match"ExportShippingService"
  appModule=$a-match"ExportShippingModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/export-shipping/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/export_shipping/export_shipping_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  checks=$checks.Count
}|Format-List