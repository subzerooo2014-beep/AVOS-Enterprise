$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7-mega-pack-14"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V7 MEGA PACK 14 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    throw "Mega Pack 14 verification failed"
}

if (-not $Evidence.verified) {
    throw "Mega Pack 14 evidence chain failed"
}

[PSCustomObject]@{
    success                     = $Verification.success
    system                      = $Verification.system
    version                     = $Verification.version
    healthStatus                = $Verification.healthStatus
    evidenceChainVerified       = $Verification.evidenceChainVerified
    configurations              = $Verification.snapshot.configurations
    activeConfigurations        = $Verification.snapshot.activeConfigurations
    rolledBackConfigurations    = $Verification.snapshot.rolledBackConfigurations
    approvals                   = $Verification.snapshot.approvals
    approvedApprovals           = $Verification.snapshot.approvedApprovals
    featureFlags                = $Verification.snapshot.featureFlags
    activeFeatureFlags          = $Verification.snapshot.activeFeatureFlags
    enabledFeatureFlags         = $Verification.snapshot.enabledFeatureFlags
    featureEvaluations          = $Verification.snapshot.featureEvaluations
    rollouts                    = $Verification.snapshot.rollouts
    completedRollouts           = $Verification.snapshot.completedRollouts
    failedRollouts              = $Verification.snapshot.failedRollouts
    configurationDrifts         = $Verification.snapshot.configurationDrifts
    openDrifts                  = $Verification.snapshot.openDrifts
    remediatedDrifts            = $Verification.snapshot.remediatedDrifts
    runtimePolicies             = $Verification.snapshot.runtimePolicies
    activeRuntimePolicies       = $Verification.snapshot.activeRuntimePolicies
    policyEvaluations           = $Verification.snapshot.policyEvaluations
    deniedPolicyEvaluations     = $Verification.snapshot.deniedPolicyEvaluations
    healthRules                 = $Verification.snapshot.healthRules
    activeHealthRules           = $Verification.snapshot.activeHealthRules
    healthEvaluations           = $Verification.snapshot.healthEvaluations
    passedHealthEvaluations     = $Verification.snapshot.passedHealthEvaluations
    failedHealthEvaluations     = $Verification.snapshot.failedHealthEvaluations
    evidenceEntries             = $Verification.snapshot.evidenceEntries
    platformEvents              = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "MEGA PACK 14 VERIFICATION PASSED" -ForegroundColor Green
