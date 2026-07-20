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

Write-Host "AVOS Platform Closure Pack 2 - Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/status"

Assert-True `
    ($status.status -eq "operational") `
    "Pack 2 status is not operational."

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

$orgApproval = @{
    approvedBy = "human:khalifa"
} | ConvertTo-Json

$readiness = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/organization-os/approve" `
    -ContentType "application/json" `
    -Body $orgApproval

Assert-True `
    ($readiness.multiAgentAllowed -eq $true) `
    "Organization OS readiness did not allow multi-agent operation."

$architectBody = @{
    name = "Architecture Agent"
    role = "Chief Architecture Agent"
    capabilities = @("architecture-analysis", "task-planning")
    permissions = @("inter-agent:communicate", "task:execute")
    projectIds = @("project:platform-closure")
    requestedBy = "human:khalifa"
} | ConvertTo-Json -Depth 6

$researchBody = @{
    name = "Research Agent"
    role = "Enterprise Research Agent"
    capabilities = @("research", "evidence-analysis")
    permissions = @("inter-agent:communicate", "task:execute")
    projectIds = @("project:platform-closure")
    requestedBy = "human:khalifa"
} | ConvertTo-Json -Depth 6

$architect = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/agents" `
    -ContentType "application/json" `
    -Body $architectBody

$researcher = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/agents" `
    -ContentType "application/json" `
    -Body $researchBody

$certificationBody = @{
    approvedBy = "human:khalifa"
} | ConvertTo-Json

$architect = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/agents/$($architect.id)/certify" `
    -ContentType "application/json" `
    -Body $certificationBody

$researcher = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/agents/$($researcher.id)/certify" `
    -ContentType "application/json" `
    -Body $certificationBody

Assert-True ($architect.certified -eq $true) "Architect agent was not certified."
Assert-True ($researcher.certified -eq $true) "Research agent was not certified."

$teamBody = @{
    name = "Platform Closure Intelligence Team"
    purpose = "Coordinate architecture and research for the AVOS closure roadmap."
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    requiredCapabilities = @("architecture-analysis", "research")
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

Assert-True ($team.status -eq "active") "Digital team was not activated."

$messageBody = @{
    fromAgentId = $architect.id
    toAgentId = $researcher.id
    teamId = $team.id
    type = "request"
    content = "Provide evidence for Pack 3 execution architecture."
} | ConvertTo-Json

$message = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/messages" `
    -ContentType "application/json" `
    -Body $messageBody

Assert-True ($message.teamId -eq $team.id) "Agent collaboration message failed."

$taskBody = @{
    teamId = $team.id
    title = "Analyze Pack 3 execution architecture"
    description = "Produce a governed execution architecture proposal."
    requiredCapability = "architecture-analysis"
    sensitive = $false
    strategic = $false
    requestedBy = "human:khalifa"
} | ConvertTo-Json

$task = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/tasks" `
    -ContentType "application/json" `
    -Body $taskBody

Assert-True ($task.status -eq "assigned") "Task was not capability-assigned."

$completedTask = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/tasks/$($task.id)/complete"

Assert-True ($completedTask.status -eq "completed") "Task completion failed."

$consensusBody = @{
    teamId = $team.id
    subject = "Recommended Pack 3 architecture"
    options = @("orchestrated-runtime", "direct-agent-execution")
    votes = @(
        @{
            agentId = $architect.id
            option = "orchestrated-runtime"
            confidence = 95
            rationale = "Maintains control and observability."
        },
        @{
            agentId = $researcher.id
            option = "orchestrated-runtime"
            confidence = 90
            rationale = "Evidence supports governed orchestration."
        }
    )
} | ConvertTo-Json -Depth 8

$consensus = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/consensus" `
    -ContentType "application/json" `
    -Body $consensusBody

Assert-True ($consensus.status -eq "consensus") "Consensus was not reached."

$retrospectiveBody = @{
    teamId = $team.id
    completedBy = "human:khalifa"
    summary = "Pack 2 team runtime smoke validation."
    strengths = @("Capability assignment", "Secure communication", "Consensus")
    weaknesses = @()
    lessons = @("Certified specialist agents should work through approved teams")
    improvements = @("Add durable persistence in later production hardening")
} | ConvertTo-Json -Depth 8

$retrospective = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/retrospectives" `
    -ContentType "application/json" `
    -Body $retrospectiveBody

Assert-True `
    ($retrospective.publishedToLivingMemory -eq $true) `
    "Team retrospective was not published to Living Memory."

$finalStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-2/status"

Write-Host ""
Write-Host "Smoke Test Passed" -ForegroundColor Green
Write-Host ("Team ID          : {0}" -f $team.id)
Write-Host ("Team Status      : {0}" -f $team.status)
Write-Host ("Certified Agents : {0}" -f $finalStatus.metrics.certifiedAgents)
Write-Host ("Completed Tasks  : {0}" -f $finalStatus.metrics.completedTasks)
Write-Host ("Consensus        : {0}" -f $consensus.selectedOption)
Write-Host ("Retrospective    : {0}" -f $retrospective.id)