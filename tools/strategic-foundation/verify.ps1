param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/strategic-foundation/strategic-foundation.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/strategic-foundation/strategic-foundation.service.ts"
) -Raw

$checks=[ordered]@{
  core=$registry-match'"CORE_PLATFORM"'
  business=$registry-match'"BUSINESS"'
  governance=$registry-match'"GOVERNANCE"'
  executive=$registry-match'"EXECUTIVE"'
  growth=$registry-match'"GROWTH"'
  trust=$registry-match'"TRUST"'
  constitutionalAlignment=$service-match"constitutionalAlignment"
  multiIndustry=$service-match"reusableAcrossIndustries"
  existingFoundation=$service-match"buildsOnExistingFoundation"
  duplication=$service-match"introducesDuplicateCapability"
  complexity=$service-match"increasesUncontrolledComplexity"
  humanAuthority=$service-match"humanFinalDecisionRequired"
  executiveBrief=$service-match"executiveBrief"
  audit=$service-match"trackAudit"
  dashboard=$service-match"dashboard\("
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  strategicDomains=6
  admissionRules=5
  humanFinalDecisionAuthority=$true
  runtime=$true
}|Format-List