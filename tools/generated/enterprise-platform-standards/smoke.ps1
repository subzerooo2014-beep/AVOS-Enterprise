$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-platform-standards/enterprise-platform-standards.module.ts",
  "apps/web/src/app/enterprise-platform-standards/page.tsx",
  "apps/mobile/lib/features/enterprise_platform_standards/enterprise_platform_standards_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Platform Standards"; smoke="PASS" } | Format-List