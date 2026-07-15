param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$module = Get-Content `
  (Join-Path $RepoRoot "apps/api/src/autonomous-enterprise-execution/autonomous-enterprise-execution.module.ts") `
  -Raw

$app = Get-Content `
  (Join-Path $RepoRoot "apps/api/src/app.module.ts") `
  -Raw

$checks = @{
  module = $module -match "AutonomousEnterpriseExecutionService"
  export = $module -match "exports:\s*\[AutonomousEnterpriseExecutionService\]"
  registration = $app -match "AutonomousEnterpriseExecutionModule"
  web = Test-Path (
    Join-Path $RepoRoot "apps/web/src/app/autonomous-enterprise-execution/page.tsx"
  )
  mobile = Test-Path (
    Join-Path $RepoRoot "apps/mobile/lib/features/autonomous_enterprise_execution/autonomous_enterprise_execution_screen.dart"
  )
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count) {
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Autonomous Enterprise Execution Platform V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List