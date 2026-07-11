$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7-mega-pack-9"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V7 MEGA PACK 9 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

try {
    $Status = Invoke-RestMethod `
        -Method Get `
        -Uri "$BaseUrl/status"

    $Verification = Invoke-RestMethod `
        -Method Get `
        -Uri "$BaseUrl/verify"

    $EvidenceVerification = Invoke-RestMethod `
        -Method Get `
        -Uri "$BaseUrl/evidence/verify"

    if (-not $Status.success) {
        throw "Mega Pack 9 status endpoint returned success=false"
    }

    if (-not $Verification.success) {
        throw "Mega Pack 9 verification returned success=false"
    }

    if (-not $EvidenceVerification.verified) {
        throw "Mega Pack 9 evidence chain verification failed"
    }

    [PSCustomObject]@{
        success                    = $Verification.success
        system                     = $Verification.system
        version                    = $Verification.version
        healthStatus               = $Verification.healthStatus
        evidenceChainVerified      = $Verification.evidenceChainVerified
        profiles                   = $Verification.snapshot.profiles
        activeProfiles             = $Verification.snapshot.activeProfiles
        recoveryPlans              = $Verification.snapshot.recoveryPlans
        activeRecoveryPlans        = $Verification.snapshot.activeRecoveryPlans
        recoveryExecutions         = $Verification.snapshot.recoveryExecutions
        completedRecoveries        = $Verification.snapshot.completedRecoveries
        failedRecoveries           = $Verification.snapshot.failedRecoveries
        continuityExercises        = $Verification.snapshot.continuityExercises
        passedExercises            = $Verification.snapshot.passedExercises
        dependencyChecks           = $Verification.snapshot.dependencyChecks
        degradedDependencies       = $Verification.snapshot.degradedDependencies
        unavailableDependencies    = $Verification.snapshot.unavailableDependencies
        checkpoints                = $Verification.snapshot.checkpoints
        verifiedCheckpoints        = $Verification.snapshot.verifiedCheckpoints
        failureSimulations         = $Verification.snapshot.failureSimulations
        evidenceEntries            = $Verification.snapshot.evidenceEntries
        platformEvents             = $Verification.snapshot.platformEvents
    } | Format-List

    Write-Host ""
    Write-Host "MEGA PACK 9 VERIFICATION PASSED" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "MEGA PACK 9 VERIFICATION FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
