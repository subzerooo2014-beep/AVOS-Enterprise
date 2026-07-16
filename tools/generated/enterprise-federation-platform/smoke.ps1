$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-federation-platform/enterprise-federation-platform.module.ts",
  "apps/web/src/app/enterprise-federation-platform/page.tsx",
  "apps/mobile/lib/features/enterprise_federation_platform/enterprise_federation_platform_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Federation Platform"; smoke="PASS" } | Format-List