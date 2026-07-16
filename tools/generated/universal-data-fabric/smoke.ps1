$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/universal-data-fabric/universal-data-fabric.module.ts",
  "apps/web/src/app/universal-data-fabric/page.tsx",
  "apps/mobile/lib/features/universal_data_fabric/universal_data_fabric_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Universal Data Fabric"; smoke="PASS" } | Format-List