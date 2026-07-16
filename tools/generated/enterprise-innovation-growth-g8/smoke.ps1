$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-innovation-growth-g8/enterprise-innovation-growth-g8.module.ts",
  "apps/web/src/app/enterprise-innovation-growth-g8/page.tsx",
  "apps/mobile/lib/features/enterprise_innovation_growth_g8/enterprise_innovation_growth_g8_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Innovation and Growth Mega Bundle G8"; smoke="PASS" } | Format-List