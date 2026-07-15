param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/transaction-lifecycle/transaction-lifecycle.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"TransactionLifecycleController"
  service=$module-match"TransactionLifecycleService"
  exported=$module-match"exports:\s*\[TransactionLifecycleService\]"
  appModule=$appModule-match"TransactionLifecycleModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/transaction-lifecycle/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/transaction_lifecycle/transaction_lifecycle_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  checks=$checks.Count
}