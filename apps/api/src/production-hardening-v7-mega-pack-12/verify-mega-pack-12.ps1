$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7-mega-pack-12"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V7 MEGA PACK 12 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    throw "Mega Pack 12 verification failed"
}

if (-not $Evidence.verified) {
    throw "Mega Pack 12 evidence chain failed"
}

[PSCustomObject]@{
    success                       = $Verification.success
    system                        = $Verification.system
    version                       = $Verification.version
    healthStatus                  = $Verification.healthStatus
    evidenceChainVerified         = $Verification.evidenceChainVerified
    serviceLevelObjectives        = $Verification.snapshot.serviceLevelObjectives
    activeServiceLevelObjectives  = $Verification.snapshot.activeServiceLevelObjectives
    breachedServiceLevelObjectives = $Verification.snapshot.breachedServiceLevelObjectives
    metricSamples                 = $Verification.snapshot.metricSamples
    sloEvaluations                = $Verification.snapshot.sloEvaluations
    passedEvaluations             = $Verification.snapshot.passedEvaluations
    failedEvaluations             = $Verification.snapshot.failedEvaluations
    errorBudgets                  = $Verification.snapshot.errorBudgets
    healthyErrorBudgets           = $Verification.snapshot.healthyErrorBudgets
    exhaustedErrorBudgets         = $Verification.snapshot.exhaustedErrorBudgets
    capacityForecasts             = $Verification.snapshot.capacityForecasts
    highRiskForecasts             = $Verification.snapshot.highRiskForecasts
    criticalRiskForecasts         = $Verification.snapshot.criticalRiskForecasts
    trafficPolicies               = $Verification.snapshot.trafficPolicies
    activeTrafficPolicies         = $Verification.snapshot.activeTrafficPolicies
    triggeredTrafficPolicies      = $Verification.snapshot.triggeredTrafficPolicies
    protectionExecutions          = $Verification.snapshot.protectionExecutions
    reliabilityDecisions          = $Verification.snapshot.reliabilityDecisions
    evidenceEntries               = $Verification.snapshot.evidenceEntries
    platformEvents                = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "MEGA PACK 12 VERIFICATION PASSED" -ForegroundColor Green
