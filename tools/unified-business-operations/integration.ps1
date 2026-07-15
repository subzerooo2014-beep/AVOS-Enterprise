param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/unified-business-operations/unified-business-operations.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"UnifiedBusinessOperationsController"
  orchestrator=$module-match"UnifiedBusinessOperationsService"
  workflows=$module-match"WorkflowOrchestratorService"
  automation=$module-match"EnterpriseAutomationService"
  commandCenter=$module-match"OperationsCommandCenterService"
  aiOperations=$module-match"AiOperationsService"
  appModule=$appModule-match"UnifiedBusinessOperationsModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/unified-business-operations/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/unified_business_operations/unified_business_operations_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  checks=$checks.Count
}|Format-List