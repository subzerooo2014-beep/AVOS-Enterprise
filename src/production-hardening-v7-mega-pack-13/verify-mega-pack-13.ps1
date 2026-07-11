$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7-mega-pack-13"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V7 MEGA PACK 13 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    throw "Mega Pack 13 verification failed"
}

if (-not $Evidence.verified) {
    throw "Mega Pack 13 evidence chain failed"
}

[PSCustomObject]@{
    success                      = $Verification.success
    system                       = $Verification.system
    version                      = $Verification.version
    healthStatus                 = $Verification.healthStatus
    evidenceChainVerified        = $Verification.evidenceChainVerified
    dataAssets                   = $Verification.snapshot.dataAssets
    activeDataAssets             = $Verification.snapshot.activeDataAssets
    restrictedDataAssets         = $Verification.snapshot.restrictedDataAssets
    personalDataAssets           = $Verification.snapshot.personalDataAssets
    retentionPolicies            = $Verification.snapshot.retentionPolicies
    activeRetentionPolicies      = $Verification.snapshot.activeRetentionPolicies
    legalHolds                   = $Verification.snapshot.legalHolds
    lineageNodes                 = $Verification.snapshot.lineageNodes
    lineageEdges                 = $Verification.snapshot.lineageEdges
    accessReviews                = $Verification.snapshot.accessReviews
    approvedAccessReviews        = $Verification.snapshot.approvedAccessReviews
    revokedAccessReviews         = $Verification.snapshot.revokedAccessReviews
    privacyRequests              = $Verification.snapshot.privacyRequests
    completedPrivacyRequests     = $Verification.snapshot.completedPrivacyRequests
    rejectedPrivacyRequests      = $Verification.snapshot.rejectedPrivacyRequests
    dataQualityRules             = $Verification.snapshot.dataQualityRules
    activeDataQualityRules       = $Verification.snapshot.activeDataQualityRules
    dataQualityEvaluations       = $Verification.snapshot.dataQualityEvaluations
    passedDataQualityEvaluations = $Verification.snapshot.passedDataQualityEvaluations
    failedDataQualityEvaluations = $Verification.snapshot.failedDataQualityEvaluations
    evidenceEntries              = $Verification.snapshot.evidenceEntries
    platformEvents               = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "MEGA PACK 13 VERIFICATION PASSED" -ForegroundColor Green
