$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7/mega-pack-7"

Write-Host ""
Write-Host "============================================"
Write-Host "AVOS V7 MEGA PACK 7 VERIFICATION"
Write-Host "============================================"
Write-Host ""

$InitialStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/status"

$Slos = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/slos"

if (-not $Slos -or $Slos.Count -lt 1) {
    throw "No SLO was initialized."
}

$SloId = $Slos[0].id

$SignalBody = @{
    successfulEvents = 9999
    totalEvents = 10000
    latencyP95Ms = 180
    errorCount = 1
    impactMinutes = 0.5
    source = "mega-pack-7-verification"
    metadata = @{
        verification = $true
        environment = "production"
    }
} | ConvertTo-Json -Depth 20

$SignalResult = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/slos/$SloId/signals" `
    -ContentType "application/json" `
    -Body $SignalBody

$ReleaseBody = @{
    version = "v7-mega-pack-7-verification"
    environment = "production"
    service = "avos-api"
    requestedBy = "AVOS Verification Engine"
    changeRiskScore = 20
    rollbackReady = $true
    monitoringReady = $true
    testCoveragePercentage = 95
    securityVerified = $true
    evidenceVerified = $true
    metadata = @{
        verification = $true
        automated = $true
    }
} | ConvertTo-Json -Depth 20

$ReleaseResult = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/release-gates/evaluate" `
    -ContentType "application/json" `
    -Body $ReleaseBody

$DrillBody = @{
    name = "Mega Pack 7 API Failover Verification"
    service = "avos-api"
    scenario = "Simulated primary API workload loss"
    expectedOutcome = "Traffic is restored within the configured RTO"
} | ConvertTo-Json -Depth 20

$Drill = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/chaos-drills" `
    -ContentType "application/json" `
    -Body $DrillBody

$StartedDrill = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/chaos-drills/$($Drill.id)/start"

$CompleteDrillBody = @{
    status = "passed"
    observedRecoveryMinutes = 12
    evidenceVerified = $true
    findings = @(
        "Automated failover completed successfully"
    )
    remediationActions = @()
} | ConvertTo-Json -Depth 20

$CompletedDrill = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/chaos-drills/$($Drill.id)/complete" `
    -ContentType "application/json" `
    -Body $CompleteDrillBody

$EvidenceVerification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

$FinalStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/status"

if (-not $FinalStatus.success) {
    throw "Status verification failed."
}

if (-not $FinalStatus.evidenceChainVerified) {
    throw "Evidence chain verification failed."
}

if (-not $EvidenceVerification.verified) {
    throw "Evidence chain endpoint returned failure."
}

if ($ReleaseResult.evaluation.decision -eq "blocked") {
    throw "Verification release was unexpectedly blocked."
}

if ($CompletedDrill.status -ne "passed") {
    throw "Chaos drill verification failed."
}

[PSCustomObject]@{
    success                  = $true
    system                   = $FinalStatus.system
    version                  = $FinalStatus.version
    healthStatus             = $FinalStatus.healthStatus
    evidenceChainVerified    = $FinalStatus.evidenceChainVerified

    slos                     = $FinalStatus.slos
    activeSlos               = $FinalStatus.activeSlos
    healthySlos              = $FinalStatus.healthySlos
    atRiskSlos               = $FinalStatus.atRiskSlos
    exhaustedSlos            = $FinalStatus.exhaustedSlos

    signals                  = $FinalStatus.signals
    incidents                = $FinalStatus.incidents
    openIncidents            = $FinalStatus.openIncidents

    releaseCandidates        = $FinalStatus.releaseCandidates
    releaseEvaluations       = $FinalStatus.releaseEvaluations
    approvedReleases         = $FinalStatus.approvedReleases
    blockedReleases          = $FinalStatus.blockedReleases
    verificationGateDecision = $ReleaseResult.evaluation.decision
    verificationGateScore    = $ReleaseResult.evaluation.score

    continuityPlans          = $FinalStatus.continuityPlans
    validatedContinuityPlans = $FinalStatus.validatedContinuityPlans

    chaosDrills              = $FinalStatus.chaosDrills
    failedChaosDrills        = $FinalStatus.failedChaosDrills
    verificationDrillStatus  = $CompletedDrill.status

    evidenceEntries          = $FinalStatus.evidenceEntries
    platformEvents           = $FinalStatus.platformEvents
} | Format-List
