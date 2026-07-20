param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

Write-Host "AVOS Platform Closure Pack 0.5 - Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-0-5/status"

Assert-True `
    ($status.status -eq "operational") `
    "Pack 0.5 status is not operational."

Assert-True `
    ($status.controls.humanFinalAuthority -eq $true) `
    "Human Final Authority control is missing."

Assert-True `
    ($status.controls.noLearningBeforeGovernance -eq $true) `
    "Governance before learning control is missing."

$constitution = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-0-5/constitution"

Assert-True `
    ($constitution.validation.valid -eq $true) `
    "Thinking Constitution validation failed."

$linkBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    linkedBy = "human:khalifa"
} | ConvertTo-Json

$link = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-0-5/living-vision/link" `
    -ContentType "application/json" `
    -Body $linkBody

Assert-True `
    ($link.active -eq $true) `
    "Living Vision link was not activated."

$decisionBody = @{
    title = "Approve Pack 1 activation readiness"
    description = "Review governance readiness before Learning and Living Memory execution."
    type = "architecture"
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    requestedBy = "human:khalifa"
    riskLevel = "high"
    strategicImpact = $true
    technicalSensitivity = $true
    evidence = @(
        "Pack 0 completed",
        "Pack 0.5 operational"
    )
} | ConvertTo-Json -Depth 6

$decision = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-0-5/decisions" `
    -ContentType "application/json" `
    -Body $decisionBody

Assert-True `
    ($decision.status -eq "under-review") `
    "Governance decision was not placed under review."

Assert-True `
    ($decision.requiresHumanApproval -eq $true) `
    "Decision does not require Human Approval."

$approvalBody = @{
    approvedBy = "human:khalifa"
    action = "approved"
    reason = "Pack 0.5 governance baseline accepted."
} | ConvertTo-Json

$approved = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-0-5/decisions/$($decision.id)/human-approval" `
    -ContentType "application/json" `
    -Body $approvalBody

Assert-True `
    ($approved.status -eq "approved") `
    "Human Approval Gate did not approve the decision."

Write-Host ""
Write-Host "Smoke Test Passed" -ForegroundColor Green
Write-Host ("Decision ID : {0}" -f $approved.id)
Write-Host ("Status      : {0}" -f $approved.status)
Write-Host ("Approved By : {0}" -f $approved.approval.approvedBy)
Write-Host ("Council     : {0}" -f $approved.councilReview.consensus)