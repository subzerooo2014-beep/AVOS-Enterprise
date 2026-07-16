$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))

$required = @(
  "apps/api/src/pack-builder-v3/pack-builder-v3.module.ts",
  "apps/web/src/app/pack-builder-v3/page.tsx",
  "apps/mobile/lib/features/pack_builder_v3/pack_builder_v3_screen.dart",
  "tools/genesis-engine-v3/genesis-v3.ps1"
)

$missing = @($required | Where-Object {
  -not (Test-Path -LiteralPath (Join-Path $root $_))
})

if ($missing.Count -gt 0) {
  throw "Smoke missing: $($missing -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Pack Builder V3"
  smoke = "PASS"
} | Format-List