$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-finance-intelligence-g5/enterprise-finance-intelligence-g5.module.ts",
  "apps/web/src/app/enterprise-finance-intelligence-g5/page.tsx",
  "apps/mobile/lib/features/enterprise_finance_intelligence_g5/enterprise_finance_intelligence_g5_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Finance Intelligence Mega Bundle G5"; smoke="PASS" } | Format-List