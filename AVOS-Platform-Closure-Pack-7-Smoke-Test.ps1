param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) {
        throw $Message
    }
}

Write-Host "AVOS Platform Closure Pack 7 - Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-7/status"

Assert-True ($status.status -eq "operational") "Pack 7 is not operational."
Assert-True ($status.controls.recertificationGate -eq $true) "Recertification gate missing."

$linkBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    linkedBy = "human:khalifa"
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-0-5/living-vision/link" `
    -ContentType "application/json" `
    -Body $linkBody | Out-Null

$proposalBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    title = "Improve autonomous execution resilience"
    description = "Introduce a governed resilience upgrade after certification."
    proposedBy = "agent:evolution-architect"
    strategic = $true
    affectedComponents = @("workflow-runtime", "checkpoint-engine", "recovery-runtime")
    expectedBenefits = @("higher resilience", "faster recovery", "better traceability")
    risks = @("runtime regression", "certification drift")
} | ConvertTo-Json -Depth 6

$proposal = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-7/proposals" `
    -ContentType "application/json" `
    -Body $proposalBody

Assert-True ($proposal.status -eq "awaiting-approval") "Proposal did not require approval."
Assert-True ($proposal.requiresRecertification -eq $true) "Strategic proposal did not require recertification."

$approvalBody = @{
    approvedBy = "human:khalifa"
    action = "approved"
} | ConvertTo-Json

$proposal = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-7/proposals/$($proposal.id)/human-approval" `
    -ContentType "application/json" `
    -Body $approvalBody

$planBody = @{
    steps = @(
        "Create backup",
        "Apply upgrade",
        "Run TypeScript verification",
        "Run NestJS build",
        "Run smoke tests",
        "Run recertification"
    )
    rollbackPlan = @(
        "Restore previous source snapshot",
        "Restart previous runtime",
        "Verify platform health"
    )
    validationChecks = @(
        "tsc --noEmit",
        "pnpm build",
        "platform closure smoke test",
        "certification score 100"
    )
    createdBy = "agent:evolution-architect"
} | ConvertTo-Json -Depth 6

$plan = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-7/proposals/$($proposal.id)/upgrade-plan" `
    -ContentType "application/json" `
    -Body $planBody

$planApproval = @{
    approvedBy = "human:khalifa"
} | ConvertTo-Json

$plan = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-7/upgrade-plans/$($plan.id)/human-approval" `
    -ContentType "application/json" `
    -Body $planApproval

$completeBody = @{
    completedBy = "human:khalifa"
} | ConvertTo-Json

$plan = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-7/upgrade-plans/$($plan.id)/complete" `
    -ContentType "application/json" `
    -Body $completeBody

Assert-True ($plan.status -eq "completed") "Upgrade plan did not complete."

$finalStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-7/status"

Assert-True ($finalStatus.metrics.implemented -ge 1) "Implemented evolution metric failed."
Assert-True ($finalStatus.metrics.completedUpgrades -ge 1) "Completed upgrade metric failed."
Assert-True ($finalStatus.metrics.auditRecords -ge 4) "Audit trail metric failed."

Write-Host ""
Write-Host "Smoke Test Passed" -ForegroundColor Green
Write-Host ("Proposal ID              : {0}" -f $proposal.id)
Write-Host ("Impact Score             : {0}" -f $proposal.impactScore)
Write-Host ("Risk Score               : {0}" -f $proposal.riskScore)
Write-Host ("Recertification Required : {0}" -f $proposal.requiresRecertification)
Write-Host ("Upgrade Plan ID          : {0}" -f $plan.id)
Write-Host ("Upgrade Status           : {0}" -f $plan.status)
Write-Host ("Audit Records            : {0}" -f $finalStatus.metrics.auditRecords)