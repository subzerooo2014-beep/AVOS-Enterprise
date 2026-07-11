$ErrorActionPreference = "Stop"

$BaseUrl =
    "http://localhost:3000/production-hardening-v8-mega-pack-3"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V8 MEGA PACK 3 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

try {
    $Health =
        Invoke-RestMethod `
            -Method Get `
            -Uri "$BaseUrl/health"

    $Verification =
        Invoke-RestMethod `
            -Method Get `
            -Uri "$BaseUrl/verification"

    $Evidence =
        Invoke-RestMethod `
            -Method Get `
            -Uri "$BaseUrl/evidence/verify"

    $Status =
        Invoke-RestMethod `
            -Method Get `
            -Uri "$BaseUrl/status"
}
catch {
    Write-Host ""
    Write-Host "Could not contact the AVOS API server." -ForegroundColor Red
    Write-Host "Make sure the server terminal is running pnpm start:dev." -ForegroundColor Yellow
    Write-Host ""
    throw
}

$Success =
    [bool](
        $Health.success -and
        $Verification.success -and
        $Evidence.valid -and
        $Status.healthStatus -eq "healthy"
    )

$Result = [PSCustomObject][ordered]@{
    success = $Success

    system =
        $Verification.system

    version =
        $Verification.version

    healthStatus =
        $Status.healthStatus

    evidenceChainVerified =
        $Status.evidenceChainVerified

    controlMode =
        $Status.controlMode

    configurations =
        $Status.configurations

    activeConfigurations =
        $Status.activeConfigurations

    pendingApprovals =
        $Status.pendingApprovals

    policies =
        $Status.policies

    activePolicies =
        $Status.activePolicies

    riskEvaluations =
        $Status.riskEvaluations

    blockedEvaluations =
        $Status.blockedEvaluations

    signals =
        $Status.signals

    unhealthySignals =
        $Status.unhealthySignals

    incidents =
        $Status.incidents

    openIncidents =
        $Status.openIncidents

    actions =
        $Status.actions

    runningActions =
        $Status.runningActions

    failedActions =
        $Status.failedActions

    baselines =
        $Status.baselines

    activeBaselines =
        $Status.activeBaselines

    evidenceEntries =
        $Status.evidenceEntries

    verificationChecksPassed =
        $Verification.checksPassed

    verificationChecksFailed =
        $Verification.checksFailed
}

$Result | Format-List

if (-not $Success) {
    Write-Host ""
    Write-Host "Mega Pack 3 verification failed." -ForegroundColor Red

    $FailedChecks =
        @(
            $Verification.checks |
            Where-Object {
                -not $_.success
            }
        )

    if ($FailedChecks.Count -gt 0) {
        Write-Host ""
        Write-Host "Failed checks:" -ForegroundColor Yellow

        $FailedChecks |
            Select-Object `
                name,
                expected,
                actual |
            Format-Table -AutoSize
    }

    exit 1
}

Write-Host ""
Write-Host "Mega Pack 3 verification passed." -ForegroundColor Green
