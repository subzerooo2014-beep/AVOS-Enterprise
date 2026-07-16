$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/architecture-compliance-platform/architecture-compliance-platform.module.ts",
  "apps/web/src/app/architecture-compliance-platform/page.tsx",
  "apps/mobile/lib/features/architecture_compliance_platform/architecture_compliance_platform_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Architecture Compliance Platform"; smoke="PASS" } | Format-List