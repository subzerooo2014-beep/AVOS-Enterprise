$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7-mega-pack-11"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V7 MEGA PACK 11 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$Verification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/verify"

$Evidence = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

if (-not $Verification.success) {
    throw "Mega Pack 11 verification failed"
}

if (-not $Evidence.verified) {
    throw "Mega Pack 11 evidence chain failed"
}

[PSCustomObject]@{
    success                    = $Verification.success
    system                     = $Verification.system
    version                    = $Verification.version
    healthStatus               = $Verification.healthStatus
    evidenceChainVerified      = $Verification.evidenceChainVerified
    commandCenterSessions      = $Verification.snapshot.commandCenterSessions
    activeCommandCenters       = $Verification.snapshot.activeCommandCenters
    changeFreezes              = $Verification.snapshot.changeFreezes
    activeChangeFreezes        = $Verification.snapshot.activeChangeFreezes
    freezeExceptions           = $Verification.snapshot.freezeExceptions
    approvedFreezeExceptions   = $Verification.snapshot.approvedFreezeExceptions
    incidents                  = $Verification.snapshot.incidents
    openIncidents              = $Verification.snapshot.openIncidents
    resolvedIncidents          = $Verification.snapshot.resolvedIncidents
    criticalIncidents          = $Verification.snapshot.criticalIncidents
    escalationRules            = $Verification.snapshot.escalationRules
    activeEscalationRules      = $Verification.snapshot.activeEscalationRules
    escalations                = $Verification.snapshot.escalations
    completedEscalations       = $Verification.snapshot.completedEscalations
    operationalDecisions       = $Verification.snapshot.operationalDecisions
    executiveReports           = $Verification.snapshot.executiveReports
    evidenceEntries            = $Verification.snapshot.evidenceEntries
    platformEvents             = $Verification.snapshot.platformEvents
} | Format-List

Write-Host ""
Write-Host "MEGA PACK 11 VERIFICATION PASSED" -ForegroundColor Green
