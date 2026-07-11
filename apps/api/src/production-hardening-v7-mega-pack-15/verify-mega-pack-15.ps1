$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7-mega-pack-15"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V7 MEGA PACK 15 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    throw "Mega Pack 15 verification failed"
}

if (-not $Evidence.verified) {
    throw "Mega Pack 15 evidence chain failed"
}

[PSCustomObject]@{
    success                         = $Verification.success
    system                          = $Verification.system
    version                         = $Verification.version
    healthStatus                    = $Verification.healthStatus
    evidenceChainVerified           = $Verification.evidenceChainVerified
    certifications                  = $Verification.snapshot.certifications
    certifiedCertifications         = $Verification.snapshot.certifiedCertifications
    rejectedCertifications          = $Verification.snapshot.rejectedCertifications
    readinessGates                  = $Verification.snapshot.readinessGates
    passedReadinessGates            = $Verification.snapshot.passedReadinessGates
    warningReadinessGates           = $Verification.snapshot.warningReadinessGates
    failedReadinessGates            = $Verification.snapshot.failedReadinessGates
    operationalAcceptances          = $Verification.snapshot.operationalAcceptances
    approvedOperationalAcceptances  = $Verification.snapshot.approvedOperationalAcceptances
    executiveSignOffs               = $Verification.snapshot.executiveSignOffs
    approvedExecutiveSignOffs       = $Verification.snapshot.approvedExecutiveSignOffs
    evidenceConsolidations          = $Verification.snapshot.evidenceConsolidations
    verifiedEvidenceConsolidations  = $Verification.snapshot.verifiedEvidenceConsolidations
    scorecards                      = $Verification.snapshot.scorecards
    certificateDocuments            = $Verification.snapshot.certificateDocuments
    validCertificateDocuments       = $Verification.snapshot.validCertificateDocuments
    evidenceEntries                 = $Verification.snapshot.evidenceEntries
    platformEvents                  = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "MEGA PACK 15 VERIFICATION PASSED" -ForegroundColor Green
