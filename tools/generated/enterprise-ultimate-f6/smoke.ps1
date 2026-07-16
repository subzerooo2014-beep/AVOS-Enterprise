$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-ultimate-f6/enterprise-ultimate-f6.module.ts",
  "apps/web/src/app/enterprise-ultimate-f6/page.tsx",
  "apps/mobile/lib/features/enterprise_ultimate_f6/enterprise_ultimate_f6_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Ultimate Mega Bundle F6"; smoke="PASS" } | Format-List