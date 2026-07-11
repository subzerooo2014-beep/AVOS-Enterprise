$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7-mega-pack-10"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V7 MEGA PACK 10 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    throw "Mega Pack 10 verification failed"
}

if (-not $Evidence.verified) {
    throw "Mega Pack 10 evidence chain failed"
}

[PSCustomObject]@{
    success                    = $Verification.success
    system                     = $Verification.system
    version                    = $Verification.version
    healthStatus               = $Verification.healthStatus
    evidenceChainVerified      = $Verification.evidenceChainVerified
    releases                   = $Verification.snapshot.releases
    approvedReleases           = $Verification.snapshot.approvedReleases
    deployedReleases           = $Verification.snapshot.deployedReleases
    rejectedReleases           = $Verification.snapshot.rejectedReleases
    rolledBackReleases         = $Verification.snapshot.rolledBackReleases
    artifacts                  = $Verification.snapshot.artifacts
    verifiedArtifacts          = $Verification.snapshot.verifiedArtifacts
    releaseGates               = $Verification.snapshot.releaseGates
    passedGates                = $Verification.snapshot.passedGates
    failedGates                = $Verification.snapshot.failedGates
    rollbackPlans              = $Verification.snapshot.rollbackPlans
    validatedRollbackPlans     = $Verification.snapshot.validatedRollbackPlans
    readinessAssessments       = $Verification.snapshot.readinessAssessments
    readyAssessments           = $Verification.snapshot.readyAssessments
    deploymentExecutions       = $Verification.snapshot.deploymentExecutions
    completedDeployments       = $Verification.snapshot.completedDeployments
    failedDeployments          = $Verification.snapshot.failedDeployments
    evidenceEntries            = $Verification.snapshot.evidenceEntries
    platformEvents             = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "MEGA PACK 10 VERIFICATION PASSED" -ForegroundColor Green
