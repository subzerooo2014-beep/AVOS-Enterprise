$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/ultimate-strategy-platform/ultimate-strategy-platform.module.ts",
  "apps/web/src/app/ultimate-strategy-platform/page.tsx",
  "apps/mobile/lib/features/ultimate_strategy_platform/ultimate_strategy_platform_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Ultimate Strategy Platform"; smoke="PASS" } | Format-List