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

Write-Host "AVOS Platform Closure Pack 3 - Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-3/status"

Assert-True ($status.status -eq "operational") "Pack 3 is not operational."
Assert-True ($status.controls.organizationBeforeExecution -eq $true) "Organization-before-execution control missing."
Assert-True ($status.controls.humanApprovalCheckpoints -eq $true) "Human approval checkpoints missing."

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

$architect = New-CertifiedAgent `
    -Name "Execution Architecture Agent" `
    -Role "Execution Architect" `
    -Capabilities @("architecture-analysis", "task-planning")

$researcher = New-CertifiedAgent `
    -Name "Execution Research Agent" `
    -Role "Execution Researcher" `
    -Capabilities @("research")

$teamBody = @{
    name = "Autonomous Execution Team"
    purpose = "Execute approved platform closure workflows."
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    requiredCapabilities = @("architecture-analysis", "research", "task-planning")
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

Assert-True ($team.status -eq "active") "Execution team was not activated."

$workflowBody = @{
    projectId = "project:platform-closure"
    livingVisionId = "living-vision:avos"
    teamId = $team.id
    goal = "Validate autonomous execution runtime"
    priority = "high"
    requestedBy = "human:khalifa"
    strategic = $true
    sensitive = $false
} | ConvertTo-Json -Depth 8

$workflow = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-3/workflows" `
    -ContentType "application/json" `
    -Body $workflowBody

Assert-True ($workflow.status -eq "awaiting-approval") "Strategic workflow did not require approval."

$workflowApproval = @{
    approvedBy = "human:khalifa"
    action = "approved"
} | ConvertTo-Json

$workflow = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-3/workflows/$($workflow.id)/human-approval" `
    -ContentType "application/json" `
    -Body $workflowApproval

$workflow = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-3/workflows/$($workflow.id)/start"

Assert-True ($workflow.status -eq "running") "Workflow did not start."

while ($workflow.status -eq "running") {
    $readyStep = $workflow.steps | Where-Object { $_.status -eq "ready" } | Select-Object -First 1

    if ($null -eq $readyStep) {
        $blockedStep = $workflow.steps | Where-Object { $_.status -eq "blocked" } | Select-Object -First 1

        if ($null -ne $blockedStep) {
            $stepApproval = @{
                approvedBy = "human:khalifa"
            } | ConvertTo-Json

            $workflow = Invoke-RestMethod `
                -Method Post `
                -Uri "$BaseUrl/avos/platform-closure/pack-3/workflows/$($workflow.id)/steps/$($blockedStep.id)/human-approval" `
                -ContentType "application/json" `
                -Body $stepApproval

            continue
        }

        break
    }

    $executeBody = @{
        actualCost = $readyStep.estimatedCost
        fail = $false
    } | ConvertTo-Json

    $workflow = Invoke-RestMethod `
        -Method Post `
        -Uri "$BaseUrl/avos/platform-closure/pack-3/workflows/$($workflow.id)/steps/$($readyStep.id)/execute" `
        -ContentType "application/json" `
        -Body $executeBody
}

Assert-True ($workflow.status -eq "completed") "Workflow did not complete."

$dashboard = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-3/dashboard"

Assert-True ($dashboard.completed -ge 1) "Dashboard did not report completion."
Assert-True ($dashboard.checkpoints -ge 3) "Expected execution checkpoints were not created."

Write-Host ""
Write-Host "Smoke Test Passed" -ForegroundColor Green
Write-Host ("Workflow ID       : {0}" -f $workflow.id)
Write-Host ("Workflow Status   : {0}" -f $workflow.status)
Write-Host ("Completed Steps   : {0}" -f $dashboard.completedSteps)
Write-Host ("Checkpoints       : {0}" -f $dashboard.checkpoints)
Write-Host ("Estimated Cost    : {0}" -f $dashboard.totalEstimatedCost)
Write-Host ("Actual Cost       : {0}" -f $dashboard.totalActualCost)