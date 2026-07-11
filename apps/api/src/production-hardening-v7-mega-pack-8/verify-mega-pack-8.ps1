$ErrorActionPreference = "Stop"

$BaseUrl = "http://localhost:3000/production-hardening-v7/mega-pack-8"

Write-Host ""
Write-Host "============================================"
Write-Host "AVOS V7 MEGA PACK 8 VERIFICATION"
Write-Host "============================================"
Write-Host ""

$InitialStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/status"

$TimeoutBody = @{
    key = "http.timeoutMs"
    service = "avos-api"
    environment = "production"
    value = 10000
    sensitive = $false
    description = "Production HTTP timeout"
    requestedBy = "AVOS Verification Engine"
} | ConvertTo-Json -Depth 20

$TimeoutRequest = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/configurations" `
    -ContentType "application/json" `
    -Body $TimeoutBody

if (
    $TimeoutRequest.evaluation.result -eq
    "blocked"
) {
    throw "Valid timeout configuration was blocked."
}

$ApprovalBody = @{
    decision = "approved"
    approver = "AVOS Verification Approver"
    reason = "Verified safe production configuration"
} | ConvertTo-Json -Depth 20

$TimeoutApproval = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/configurations/$($TimeoutRequest.configuration.id)/approval" `
    -ContentType "application/json" `
    -Body $ApprovalBody

$DangerousBody = @{
    key = "features.dangerousMode"
    service = "avos-api"
    environment = "production"
    value = $false
    sensitive = $false
    description = "Dangerous mode protection"
    requestedBy = "AVOS Verification Engine"
} | ConvertTo-Json -Depth 20

$DangerousRequest = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/configurations" `
    -ContentType "application/json" `
    -Body $DangerousBody

$DangerousApproval = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/configurations/$($DangerousRequest.configuration.id)/approval" `
    -ContentType "application/json" `
    -Body $ApprovalBody

$Snapshot = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/snapshot"

$Baseline = $Snapshot.baselines |
    Where-Object {
        $_.service -eq "avos-api" -and
        $_.environment -eq "production" -and
        $_.active -eq $true
    } |
    Select-Object -First 1

if (-not $Baseline) {
    throw "Active production baseline not found."
}

$DriftResult = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/baselines/$($Baseline.id)/scan"

if ($DriftResult.status -ne "compliant") {
    throw "Configuration baseline is not compliant."
}

$FlagBody = @{
    key = "enterprise_configuration_governance"
    name = "Enterprise Configuration Governance"
    description = "Mega Pack 8 verification flag"
    service = "avos-api"
    environment = "production"
    enabled = $true
    strategy = "percentage"
    rolloutPercentage = 100
    targetServices = @("avos-api")
    targetUsers = @()
    metadata = @{
        verification = $true
    }
    createdBy = "AVOS Verification Engine"
} | ConvertTo-Json -Depth 20

$Flag = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/feature-flags" `
    -ContentType "application/json" `
    -Body $FlagBody

$FlagEvaluation = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/feature-flags/$($Flag.id)/evaluate?userId=verification-user&service=avos-api"

if (-not $FlagEvaluation.enabled) {
    throw "Feature flag verification failed."
}

$EvidenceVerification = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/evidence/verify"

$FinalStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/status"

if (-not $FinalStatus.success) {
    throw "Mega Pack 8 status verification failed."
}

if (-not $FinalStatus.evidenceChainVerified) {
    throw "Mega Pack 8 evidence chain verification failed."
}

if (-not $EvidenceVerification.verified) {
    throw "Evidence verification endpoint failed."
}

if ($FinalStatus.healthStatus -ne "healthy") {
    throw "Mega Pack 8 health is not healthy: $($FinalStatus.healthStatus)"
}

[PSCustomObject]@{
    success                    = $true
    system                     = $FinalStatus.system
    version                    = $FinalStatus.version
    healthStatus               = $FinalStatus.healthStatus
    evidenceChainVerified      = $FinalStatus.evidenceChainVerified

    configurations             = $FinalStatus.configurations
    activeConfigurations       = $FinalStatus.activeConfigurations
    pendingApprovals           = $FinalStatus.pendingApprovals
    rejectedConfigurations     = $FinalStatus.rejectedConfigurations
    rolledBackConfigurations   = $FinalStatus.rolledBackConfigurations

    policies                   = $FinalStatus.policies
    activePolicies             = $FinalStatus.activePolicies
    policyEvaluations          = $FinalStatus.policyEvaluations
    blockedEvaluations         = $FinalStatus.blockedEvaluations

    baselines                  = $FinalStatus.baselines
    activeBaselines            = $FinalStatus.activeBaselines
    driftScans                 = $FinalStatus.driftScans
    criticalDrifts             = $FinalStatus.criticalDrifts
    verificationDriftStatus    = $DriftResult.status
    compliancePercentage       = $DriftResult.compliancePercentage

    featureFlags               = $FinalStatus.featureFlags
    enabledFeatureFlags        = $FinalStatus.enabledFeatureFlags
    verificationFlagEnabled    = $FlagEvaluation.enabled

    killSwitches               = $FinalStatus.killSwitches
    activatedKillSwitches      = $FinalStatus.activatedKillSwitches

    approvals                  = $FinalStatus.approvals
    rollbacks                  = $FinalStatus.rollbacks
    evidenceEntries            = $FinalStatus.evidenceEntries
    platformEvents             = $FinalStatus.platformEvents
} | Format-List
