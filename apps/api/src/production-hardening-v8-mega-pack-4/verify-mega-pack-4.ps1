$ErrorActionPreference = "Stop"

$BaseUrl =
    "http://localhost:3000/production-hardening-v8-mega-pack-4"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS V8 MEGA PACK 4 VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

try {
    $Health =
        Invoke-RestMethod `
            -Method Get `
            -Uri "$BaseUrl/health"

    if (-not $Health.success) {
        throw "Mega Pack 4 health endpoint returned success=false"
    }

    $Verification =
        Invoke-RestMethod `
            -Method Post `
            -Uri "$BaseUrl/verification/run" `
            -ContentType "application/json" `
            -Body "{}"

    if (-not $Verification.success) {
        Write-Host ""
        Write-Host "Verification checks failed:" -ForegroundColor Red

        $Verification.checks |
            Where-Object {
                -not $_.passed
            } |
            ForEach-Object {
                Write-Host (
                    " - " +
                    $_.name
                ) -ForegroundColor Red
            }

        throw "Mega Pack 4 verification returned success=false"
    }

    $Status =
        Invoke-RestMethod `
            -Method Get `
            -Uri "$BaseUrl/status"

    [PSCustomObject]@{
        success =
            $Verification.success

        system =
            $Verification.system

        version =
            $Verification.version

        healthStatus =
            $Verification.healthStatus

        evidenceChainVerified =
            $Verification.evidenceChainVerified

        executionEvidenceVerified =
            $Verification.executionEvidenceVerified

        controlMode =
            $Verification.controlMode

        changeWindows =
            $Verification.changeWindows

        dependencyNodes =
            $Verification.dependencyNodes

        dependencyEdges =
            $Verification.dependencyEdges

        sloDefinitions =
            $Verification.sloDefinitions

        sloEvaluations =
            $Verification.sloEvaluations

        capacityPolicies =
            $Verification.capacityPolicies

        capacityEvaluations =
            $Verification.capacityEvaluations

        approvalMatrixRules =
            $Verification.approvalMatrixRules

        runbooks =
            $Verification.runbooks

        activeRunbooks =
            $Verification.activeRunbooks

        runbookExecutions =
            $Verification.runbookExecutions

        checkpoints =
            $Verification.checkpoints

        verifiedCheckpoints =
            $Verification.verifiedCheckpoints

        retentionPolicies =
            $Verification.retentionPolicies

        archives =
            $Verification.archives

        verifiedArchives =
            $Verification.verifiedArchives

        auditEntries =
            $Verification.auditEntries

        verificationChecksPassed =
            $Verification.verificationChecksPassed

        verificationChecksFailed =
            $Verification.verificationChecksFailed

        statusHealth =
            $Status.healthStatus
    } |
    Format-List
}
catch {
    Write-Host ""
    Write-Host "AVOS V8 Mega Pack 4 verification failed." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
