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

Write-Host "AVOS Platform Closure Pack 1 - Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-1/status"

Assert-True `
    ($status.status -eq "operational") `
    "Pack 1 status is not operational."

Assert-True `
    ($status.controls.governanceBeforeLearning -eq $true) `
    "Governance before learning control is missing."

Assert-True `
    ($status.controls.projectRetrospectiveRequired -eq $true) `
    "Project Retrospective control is missing."

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

$memoryBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    kind = "lesson"
    title = "Governance must precede learning"
    content = "Pack 1 may learn only after Pack 0.5 governance is active."
    source = "pack-1-smoke-test"
    tags = @("governance", "learning", "shared-learning")
    confidence = 98
    strategic = $false
    sensitive = $false
    evidence = @("pack-0.5-approved")
} | ConvertTo-Json -Depth 6

$memory = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-1/memory" `
    -ContentType "application/json" `
    -Body $memoryBody

Assert-True `
    ($memory.status -eq "approved") `
    "Non-sensitive lesson memory was not approved."

$proposalBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    title = "Improve learning evidence quality"
    hypothesis = "Learning quality improves when evidence is approved and traceable."
    evidenceMemoryIds = @($memory.id)
    expectedImpact = "Higher confidence and safer cross-project reuse."
    riskLevel = "medium"
    requestedBy = "human:khalifa"
} | ConvertTo-Json -Depth 6

$proposal = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-1/learning/proposals" `
    -ContentType "application/json" `
    -Body $proposalBody

Assert-True `
    ($proposal.status -eq "under-review") `
    "Learning proposal was not placed under review."

Assert-True `
    ($proposal.requiresHumanApproval -eq $true) `
    "Learning proposal does not require Human Approval."

$approvalBody = @{
    approvedBy = "human:khalifa"
    action = "approved"
} | ConvertTo-Json

$approved = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-1/learning/proposals/$($proposal.id)/human-approval" `
    -ContentType "application/json" `
    -Body $approvalBody

Assert-True `
    ($approved.status -eq "approved") `
    "Learning proposal approval failed."

$retrospectiveBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    completedBy = "human:khalifa"
    summary = "Pack 1 governed learning and living memory smoke validation."
    successes = @("Governance bridge worked", "Approved memory used as evidence")
    failures = @()
    lessons = @("Approved evidence must precede learning activation")
    reusableInsights = @("Project retrospectives should publish reusable lessons")
    followUpActions = @("Proceed to Pack 2 after Pack 1 certification")
} | ConvertTo-Json -Depth 8

$retrospective = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-1/retrospectives" `
    -ContentType "application/json" `
    -Body $retrospectiveBody

Assert-True `
    ($retrospective.publishedToSharedMemory -eq $true) `
    "Retrospective was not published to shared memory."

$finalStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-1/status"

Write-Host ""
Write-Host "Smoke Test Passed" -ForegroundColor Green
Write-Host ("Memory ID       : {0}" -f $memory.id)
Write-Host ("Learning ID     : {0}" -f $approved.id)
Write-Host ("Learning Status : {0}" -f $approved.status)
Write-Host ("Retrospective   : {0}" -f $retrospective.id)
Write-Host ("Shared Lessons  : {0}" -f $finalStatus.metrics.sharedLessons)