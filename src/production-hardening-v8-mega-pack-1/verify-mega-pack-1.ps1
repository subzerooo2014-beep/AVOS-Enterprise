$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v8-mega-pack-1"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V8 MEGA PACK 1 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    Write-Host ""
    Write-Host "VERIFICATION CHECKS" -ForegroundColor Yellow

    $Verification.checks |
        Format-List

    throw "V8 Mega Pack 1 verification failed"
}

if (-not $Evidence.verified) {
    throw "V8 Mega Pack 1 evidence chain verification failed"
}

if ($Verification.healthStatus -ne "healthy") {
    throw "V8 Mega Pack 1 health status is not healthy"
}

[PSCustomObject]@{
    success                      = $Verification.success
    system                       = $Verification.system
    version                      = $Verification.version
    healthStatus                 = $Verification.healthStatus
    evidenceChainVerified        = $Verification.evidenceChainVerified

    runtimeNodes                 = $Verification.snapshot.runtimeNodes
    healthyRuntimeNodes          = $Verification.snapshot.healthyRuntimeNodes
    degradedRuntimeNodes         = $Verification.snapshot.degradedRuntimeNodes
    criticalRuntimeNodes         = $Verification.snapshot.criticalRuntimeNodes

    metricSamples                = $Verification.snapshot.metricSamples

    adaptivePolicies             = $Verification.snapshot.adaptivePolicies
    activeAdaptivePolicies       = $Verification.snapshot.activeAdaptivePolicies
    runtimeAdaptations           = $Verification.snapshot.runtimeAdaptations
    completedAdaptations         = $Verification.snapshot.completedAdaptations
    failedAdaptations            = $Verification.snapshot.failedAdaptations

    predictions                  = $Verification.snapshot.predictions
    highRiskPredictions          = $Verification.snapshot.highRiskPredictions
    criticalPredictions          = $Verification.snapshot.criticalPredictions
    mitigatedPredictions         = $Verification.snapshot.mitigatedPredictions

    digitalTwins                 = $Verification.snapshot.digitalTwins
    synchronizedDigitalTwins     = $Verification.snapshot.synchronizedDigitalTwins
    digitalTwinScenarios         = $Verification.snapshot.digitalTwinScenarios
    resilientScenarios           = $Verification.snapshot.resilientScenarios

    governanceRules              = $Verification.snapshot.governanceRules
    activeGovernanceRules        = $Verification.snapshot.activeGovernanceRules
    governanceEvaluations        = $Verification.snapshot.governanceEvaluations
    deniedGovernanceEvaluations  = $Verification.snapshot.deniedGovernanceEvaluations

    evidenceEntries              = $Verification.snapshot.evidenceEntries
    platformEvents               = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "V8 MEGA PACK 1 VERIFICATION PASSED" -ForegroundColor Green
Write-Host "ADAPTIVE RUNTIME: READY" -ForegroundColor Green
Write-Host "PREDICTIVE OPERATIONS: READY" -ForegroundColor Green
Write-Host "DIGITAL TWIN: READY" -ForegroundColor Green
Write-Host "AUTONOMOUS GOVERNANCE: READY" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
