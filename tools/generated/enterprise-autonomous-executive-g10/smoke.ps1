$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-autonomous-executive-g10/enterprise-autonomous-executive-g10.module.ts",
  "apps/web/src/app/enterprise-autonomous-executive-g10/page.tsx",
  "apps/mobile/lib/features/enterprise_autonomous_executive_g10/enterprise_autonomous_executive_g10_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Autonomous Executive Mega Bundle G10"; smoke="PASS" } | Format-List