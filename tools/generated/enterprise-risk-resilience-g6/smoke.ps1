$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-risk-resilience-g6/enterprise-risk-resilience-g6.module.ts",
  "apps/web/src/app/enterprise-risk-resilience-g6/page.tsx",
  "apps/mobile/lib/features/enterprise_risk_resilience_g6/enterprise_risk_resilience_g6_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Risk and Resilience Mega Bundle G6"; smoke="PASS" } | Format-List