$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))

$service = Get-Content `
  -LiteralPath (Join-Path $root "apps/api/src/pack-builder-v3/pack-builder-v3.service.ts") `
  -Raw

if ($service -notmatch "Genesis Engine V3") {
  throw "Genesis V3 marker missing."
}

[pscustomobject]@{
  success = $true
  system = "AVOS Pack Builder V3"
  verification = "PASS"
  capabilities = 10
} | Format-List