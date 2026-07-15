param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-foundations/enterprise-foundations.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"EnterpriseFoundationsController"
  orchestrator=$module-match"EnterpriseFoundationsService"
  dataAi=$module-match"DataAiFoundationService"
  runtime=$module-match"RuntimeIntegrationFoundationService"
  identity=$module-match"IdentityMultitenancyFoundationService"
  developer=$module-match"DeveloperApiPluginFoundationService"
  legalGlobal=$module-match"LegalGlobalFoundationService"
  securityExperience=$module-match"SecurityObservabilityExperienceFoundationService"
  appModule=$appModule-match"EnterpriseFoundationsModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/enterprise-foundations/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_foundations/enterprise_foundations_screen.dart")
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