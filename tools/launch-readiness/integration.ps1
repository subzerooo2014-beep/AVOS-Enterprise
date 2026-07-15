param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/launch-readiness/launch-readiness.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"LaunchReadinessController"
  orchestrator=$module-match"LaunchOrchestratorService"
  monetization=$module-match"MonetizationService"
  readiness=$module-match"LaunchReadinessService"
  support=$module-match"SupportSlaService"
  metrics=$module-match"LaunchMetricsService"
  appModule=$appModule-match"LaunchReadinessModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/launch-readiness/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/launch_readiness/launch_readiness_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})
if($failed.Count){ throw "Integration failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  checks=$checks.Count
}|Format-List