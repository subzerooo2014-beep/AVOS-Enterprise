$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v8-mega-pack-2"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V8 MEGA PACK 2 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    $Verification.checks | Format-List
    throw "V8 Mega Pack 2 verification failed"
}

if (-not $Evidence.verified) {
    throw "V8 Mega Pack 2 evidence chain verification failed"
}

if ($Verification.healthStatus -ne "healthy") {
    throw "V8 Mega Pack 2 health status is not healthy"
}

[PSCustomObject]@{
    success                    = $Verification.success
    system                     = $Verification.system
    version                    = $Verification.version
    healthStatus               = $Verification.healthStatus
    evidenceChainVerified      = $Verification.evidenceChainVerified
    managedServices            = $Verification.snapshot.managedServices
    healthyServices            = $Verification.snapshot.healthyServices
    degradedServices           = $Verification.snapshot.degradedServices
    criticalServices           = $Verification.snapshot.criticalServices
    dependencies               = $Verification.snapshot.dependencies
    availableDependencies      = $Verification.snapshot.availableDependencies
    degradedDependencies       = $Verification.snapshot.degradedDependencies
    unavailableDependencies    = $Verification.snapshot.unavailableDependencies
    dependencyGraphEdges       = $Verification.snapshot.dependencyGraphEdges
    incidents                  = $Verification.snapshot.incidents
    resolvedIncidents          = $Verification.snapshot.resolvedIncidents
    failedIncidents            = $Verification.snapshot.failedIncidents
    rootCauseAnalyses          = $Verification.snapshot.rootCauseAnalyses
    recoveryPlans              = $Verification.snapshot.recoveryPlans
    activeRecoveryPlans        = $Verification.snapshot.activeRecoveryPlans
    recoveryExecutions         = $Verification.snapshot.recoveryExecutions
    completedRecoveries        = $Verification.snapshot.completedRecoveries
    failedRecoveries           = $Verification.snapshot.failedRecoveries
    operationsDecisions        = $Verification.snapshot.operationsDecisions
    evidenceEntries            = $Verification.snapshot.evidenceEntries
    platformEvents             = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "V8 MEGA PACK 2 VERIFICATION PASSED" -ForegroundColor Green
Write-Host "AI OPERATIONS ORCHESTRATOR: READY" -ForegroundColor Green
Write-Host "DEPENDENCY INTELLIGENCE: READY" -ForegroundColor Green
Write-Host "ROOT CAUSE ANALYSIS: READY" -ForegroundColor Green
Write-Host "AUTONOMOUS RECOVERY: READY" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
