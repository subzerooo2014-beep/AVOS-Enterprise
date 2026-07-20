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

Write-Host "AVOS Platform Closure Pack 4 - Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/status"

Assert-True ($status.status -eq "operational") "Pack 4 is not operational."
Assert-True ($status.controls.evidenceBeforeConclusion -eq $true) "Evidence-before-conclusion control missing."
Assert-True ($status.controls.dataQualityGate -eq $true) "Data quality gate missing."

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

$orgApproval = @{ approvedBy = "human:khalifa" } | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/organization-os/approve" `
    -ContentType "application/json" `
    -Body $orgApproval | Out-Null

function New-CertifiedAgent {
    param(
        [string]$Name,
        [string]$Role,
        [string[]]$Capabilities
    )

    $body = @{
        name = $Name
        role = $Role
        capabilities = $Capabilities
        permissions = @("inter-agent:communicate", "task:execute")
        projectIds = @("project:platform-closure")
        requestedBy = "human:khalifa"
    } | ConvertTo-Json -Depth 6

    $agent = Invoke-RestMethod `
        -Method Post `
        -Uri "$BaseUrl/avos/platform-closure/pack-2/agents" `
        -ContentType "application/json" `
        -Body $body

    $certification = @{
        approvedBy = "human:khalifa"
    } | ConvertTo-Json

    return Invoke-RestMethod `
        -Method Post `
        -Uri "$BaseUrl/avos/platform-closure/pack-2/agents/$($agent.id)/certify" `
        -ContentType "application/json" `
        -Body $certification
}

$researchAgent = New-CertifiedAgent `
    -Name "Knowledge Research Agent" `
    -Role "Enterprise Research Specialist" `
    -Capabilities @("research", "evidence-analysis")

$architectureAgent = New-CertifiedAgent `
    -Name "Knowledge Architecture Agent" `
    -Role "Knowledge Architect" `
    -Capabilities @("architecture-analysis", "task-planning")

$teamBody = @{
    name = "Knowledge and Research Team"
    purpose = "Validate evidence and publish governed research."
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    requiredCapabilities = @("research", "architecture-analysis")
    requestedBy = "human:khalifa"
} | ConvertTo-Json -Depth 6

$team = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/teams" `
    -ContentType "application/json" `
    -Body $teamBody

$teamApproval = @{
    approvedBy = "human:khalifa"
    action = "approved"
} | ConvertTo-Json

$team = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/teams/$($team.id)/human-approval" `
    -ContentType "application/json" `
    -Body $teamApproval

Assert-True ($team.status -eq "active") "Research team was not activated."

function New-ApprovedEvidence {
    param(
        [string]$Title,
        [string]$Reference,
        [string]$Content,
        [int]$Confidence
    )

    $body = @{
        projectId = "project:platform-closure"
        livingVisionId = "living-vision:avos"
        title = $Title
        sourceType = "internal"
        sourceReference = $Reference
        content = $Content
        confidence = $Confidence
        tags = @("platform-closure", "execution", "research")
        capturedBy = "agent:knowledge-research"
    } | ConvertTo-Json -Depth 6

    $record = Invoke-RestMethod `
        -Method Post `
        -Uri "$BaseUrl/avos/platform-closure/pack-4/evidence" `
        -ContentType "application/json" `
        -Body $body

    $record = Invoke-RestMethod `
        -Method Post `
        -Uri "$BaseUrl/avos/platform-closure/pack-4/evidence/$($record.id)/validate"

    Assert-True ($record.status -eq "validated") "Evidence validation failed."

    $approval = @{
        approvedBy = "human:khalifa"
    } | ConvertTo-Json

    return Invoke-RestMethod `
        -Method Post `
        -Uri "$BaseUrl/avos/platform-closure/pack-4/evidence/$($record.id)/approve" `
        -ContentType "application/json" `
        -Body $approval
}

$evidence1 = New-ApprovedEvidence `
    -Title "Governed execution requires checkpoints" `
    -Reference "pack-3-runtime-evidence-1" `
    -Content "Execution checkpoints preserve traceability, rollback safety, and controlled workflow recovery." `
    -Confidence 96

$evidence2 = New-ApprovedEvidence `
    -Title "Strategic conclusions require human approval" `
    -Reference "pack-3-runtime-evidence-2" `
    -Content "Human Final Authority must approve strategic research conclusions before shared publication." `
    -Confidence 98

$queryBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    query = "execution checkpoints"
    minConfidence = 90
} | ConvertTo-Json -Depth 5

$queryResult = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/knowledge/query" `
    -ContentType "application/json" `
    -Body $queryBody

Assert-True ($queryResult.total -ge 1) "Knowledge query returned no approved evidence."

$researchBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    teamId = $team.id
    question = "What controls should govern autonomous execution?"
    requiredEvidenceCount = 2
    requestedBy = "human:khalifa"
    strategic = $true
} | ConvertTo-Json -Depth 6

$research = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/research" `
    -ContentType "application/json" `
    -Body $researchBody

Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/research/$($research.id)/evidence/$($evidence1.id)" | Out-Null

$research = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/research/$($research.id)/evidence/$($evidence2.id)"

$conclusionBody = @{
    conclusion = "Autonomous execution must use approved teams, validated evidence, checkpoints, rollback support, and Human Final Authority for strategic actions."
} | ConvertTo-Json

$research = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/research/$($research.id)/conclude" `
    -ContentType "application/json" `
    -Body $conclusionBody

Assert-True ($research.status -eq "awaiting-approval") "Strategic research did not require approval."

$approvalBody = @{
    approvedBy = "human:khalifa"
    action = "approved"
} | ConvertTo-Json

$research = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/research/$($research.id)/human-approval" `
    -ContentType "application/json" `
    -Body $approvalBody

$research = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/research/$($research.id)/publish"

Assert-True ($research.status -eq "published") "Research was not published."
Assert-True ($research.publishedMemoryIds.Count -ge 1) "Research was not published to Living Memory."

$finalStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-4/status"

Assert-True ($finalStatus.metrics.approvedEvidence -ge 2) "Approved evidence metric failed."
Assert-True ($finalStatus.metrics.publishedResearch -ge 1) "Published research metric failed."

Write-Host ""
Write-Host "Smoke Test Passed" -ForegroundColor Green
Write-Host ("Team ID             : {0}" -f $team.id)
Write-Host ("Approved Evidence   : {0}" -f $finalStatus.metrics.approvedEvidence)
Write-Host ("Research ID         : {0}" -f $research.id)
Write-Host ("Research Status     : {0}" -f $research.status)
Write-Host ("Research Confidence : {0}" -f $research.confidence)
Write-Host ("Memory Publications : {0}" -f $finalStatus.metrics.livingMemoryPublications)