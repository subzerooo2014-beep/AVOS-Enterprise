$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7-mega-pack-16"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V7 MEGA PACK 16 FINAL VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    throw "Mega Pack 16 final verification failed"
}

if (-not $Evidence.verified) {
    throw "Mega Pack 16 evidence chain failed"
}

if ($Verification.v7Status -ne "COMPLETE") {
    throw "Production Hardening V7 is not complete"
}

if (-not $Verification.enterpriseReady) {
    throw "Enterprise readiness validation failed"
}

if (-not $Verification.productionCertified) {
    throw "Production certification validation failed"
}

[PSCustomObject]@{
    success                        = $Verification.success
    system                         = $Verification.system
    version                        = $Verification.version
    v7Status                       = $Verification.v7Status
    healthStatus                   = $Verification.healthStatus
    evidenceChainVerified          = $Verification.evidenceChainVerified
    enterpriseReady                = $Verification.enterpriseReady
    productionCertified            = $Verification.productionCertified
    closureRecords                 = $Verification.snapshot.closureRecords
    completedClosures              = $Verification.snapshot.completedClosures
    failedClosures                 = $Verification.snapshot.failedClosures
    megaPackValidations            = $Verification.snapshot.megaPackValidations
    passedMegaPackValidations      = $Verification.snapshot.passedMegaPackValidations
    failedMegaPackValidations      = $Verification.snapshot.failedMegaPackValidations
    consistencyChecks              = $Verification.snapshot.consistencyChecks
    passedConsistencyChecks        = $Verification.snapshot.passedConsistencyChecks
    failedConsistencyChecks        = $Verification.snapshot.failedConsistencyChecks
    immutableBaselines             = $Verification.snapshot.immutableBaselines
    sealedBaselines                = $Verification.snapshot.sealedBaselines
    verifiedBaselines              = $Verification.snapshot.verifiedBaselines
    completionCertificates         = $Verification.snapshot.completionCertificates
    verifiedCertificates           = $Verification.snapshot.verifiedCertificates
    executiveReports               = $Verification.snapshot.executiveReports
    transitionPackages             = $Verification.snapshot.transitionPackages
    readyTransitionPackages        = $Verification.snapshot.readyTransitionPackages
    acceptedTransitionPackages     = $Verification.snapshot.acceptedTransitionPackages
    finalScore                     = $Verification.closure.finalScore
    evidenceEntries                = $Verification.snapshot.evidenceEntries
    platformEvents                 = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "PRODUCTION HARDENING V7 COMPLETE" -ForegroundColor Green
Write-Host "ENTERPRISE READY: YES" -ForegroundColor Green
Write-Host "PRODUCTION CERTIFIED: YES" -ForegroundColor Green
Write-Host "MEGA PACK 16 FINAL VERIFICATION PASSED" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
