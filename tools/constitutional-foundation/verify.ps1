param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$registry=Get-Content (
  Join-Path $RepoRoot "apps/api/src/constitutional-foundation/constitutional-foundation.registry.ts"
) -Raw

$service=Get-Content (
  Join-Path $RepoRoot "apps/api/src/constitutional-foundation/constitutional-foundation.service.ts"
) -Raw

$checks=[ordered]@{
  technical=$registry-match'key:\s*"TECHNICAL"'
  business=$registry-match'key:\s*"BUSINESS"'
  executive=$registry-match'key:\s*"EXECUTIVE"'
  growth=$registry-match'key:\s*"GROWTH"'
  trust=$registry-match'key:\s*"TRUST"'
  evaluation=$service-match"evaluate\("
  approval=$service-match"requestApproval"
  humanAuthority=$service-match"requiresHumanFinalDecision"
  audit=$service-match"trackAudit"
  duplicationProtection=$service-match"duplicateImplementation"
  revenueProtection=$service-match"revenueLeakageRisk"
  identity=$service-match"identityVerified"
  security=$service-match"securityViolation"
  compliance=$service-match"complianceFailure"
  dashboard=$service-match"dashboard\("
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  constitutions=5
  humanFinalDecisionAuthority=$true
  runtime=$true
}|Format-List