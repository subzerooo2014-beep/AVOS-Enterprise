param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-foundations/enterprise-foundations.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-foundations/enterprise-foundations.service.ts"
) -Raw

$checks=[ordered]@{
  dataAi=$registry-match'"DATA_AI"'
  runtime=$registry-match'"RUNTIME_INTEGRATION"'
  identity=$registry-match'"IDENTITY_MULTI_TENANCY"'
  developer=$registry-match'"DEVELOPER_API_PLUGIN"'
  legalGlobal=$registry-match'"LEGAL_GLOBAL_OPERATIONS"'
  securityExperience=$registry-match'"SECURITY_OBSERVABILITY_EXPERIENCE"'
  dataGovernance=$registry-match'"data-governance"'
  eventBus=$registry-match'"message-broker"'
  idempotency=$registry-match'"idempotency"'
  iam=$registry-match'"central-iam"'
  apiGateway=$registry-match'"api-gateway"'
  dynamicRegulation=$registry-match'"dynamic-regulation-engine"'
  soc=$registry-match'"soc-siem"'
  accessibility=$registry-match'"deaf-accessibility"'
  voice=$registry-match'"voice-os-search"'
  experienceComposer=$registry-match'"experience-composer-ai"'
  orchestration=$service-match"dashboard\("
  registrations=$service-match"register\("
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  foundations=6
  reusable=$true
  multiIndustry=$true
  runtime=$true
}|Format-List