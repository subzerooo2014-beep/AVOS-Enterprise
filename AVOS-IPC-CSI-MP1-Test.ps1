param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Section([string]$Title) {
    Write-Host ""
    Write-Host ("=" * 114) -ForegroundColor DarkCyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host ("=" * 114) -ForegroundColor DarkCyan
}

function PostJson([string]$Uri, $Body) {
    Invoke-RestMethod -Method Post -Uri $Uri -ContentType "application/json" -Body ($Body | ConvertTo-Json -Depth 12)
}

$root = "$BaseUrl/avos/interplanetary-production-continuity"

Section "1. Runtime Status"
$status = Invoke-RestMethod -Method Get -Uri "$root/status"
$status | Format-List
if ($status.status -ne "operational") { throw "IPC-CSI runtime is not operational." }

Section "2. Multi-Planet Federation Architecture"
$nodes = Invoke-RestMethod -Method Get -Uri "$root/federation/nodes"
$nodes | Format-Table
Invoke-RestMethod -Method Get -Uri "$root/federation/status" | Format-List
if ($nodes.Count -lt 3) { throw "Expected at least three civilization nodes." }

Section "3. Civilizational Continuity Engine"
$scenario = PostJson "$root/continuity/scenarios" @{
    name = "Civilization-scale production and knowledge continuity"
    level = "civilization-preservation"
    affectedNodeIds = @("civilization-node:earth")
    requiredCapabilities = @("production", "knowledge", "recovery")
    requiresHumanApproval = $true
}
$scenario | Format-List

Section "4. Human Approval"
$approvedScenario = PostJson "$root/continuity/scenarios/$($scenario.id)/approve" @{
    approvedBy = "human:khalifa"
}
$approvedScenario | Format-List

Section "5. Autonomous Recovery Beyond Planetary Scale"
$plan = PostJson "$root/recovery/plans/$($scenario.id)" @{}
$plan | Format-List
if ($plan.selectedNodeIds.Count -lt 1) { throw "No interplanetary recovery node was selected." }
PostJson "$root/recovery/plans/$($plan.id)/activate" @{} | Format-List

Section "6. Long-Term Knowledge Preservation"
$artifact = PostJson "$root/knowledge/preserve" @{
    domain = "AVOS constitutional and production knowledge"
    title = "Civilization Continuity Knowledge Core"
    classification = "civilization-critical"
    preservationTier = 1
    replicationTargets = @($nodes | ForEach-Object { $_.id })
}
$artifact | Format-List
if (-not $artifact.immutable) { throw "Knowledge artifact is not immutable." }

Section "7. Civilization Memory Vault"
$vault = Invoke-RestMethod -Method Get -Uri "$root/memory-vault/status"
$vault | Format-List
if ($vault.artifacts -lt 1) { throw "Civilization Memory Vault is empty." }

Section "8. Autonomous Infrastructure Expansion"
$expansion = PostJson "$root/infrastructure/expansions" @{
    targetNodeId = "civilization-node:mars"
    capability = "civilization-memory"
    projectedCapacityGain = 180
}
$expansion | Format-List
PostJson "$root/infrastructure/expansions/$($expansion.id)/approve" @{
    approvedBy = "human:khalifa"
} | Format-List
PostJson "$root/infrastructure/expansions/$($expansion.id)/deploy" @{} | Format-List

Section "9. Self-Evolving Governance"
$governance = PostJson "$root/governance/evolution" @{
    title = "Delay-Tolerant Civilization Governance Protocol"
    rationale = "Preserve lawful human authority across interplanetary communication delays."
}
$governance | Format-List
PostJson "$root/governance/evolution/$($governance.id)/approve" @{
    approvedBy = "human:khalifa"
} | Format-List
PostJson "$root/governance/evolution/$($governance.id)/deploy" @{} | Format-List

Section "10. Planetary & Interplanetary Digital Twin"
Invoke-RestMethod -Method Get -Uri "$root/digital-twin" | Format-List

Section "11. Extreme Resilience & Survival Planning"
$resilience = Invoke-RestMethod -Method Get -Uri "$root/resilience/assessment"
$resilience | Format-List
if ($resilience.status -ne "excellent") { throw "Extreme resilience assessment did not reach excellent." }

Section "12. Final Review"
$review = PostJson "$root/final-review/run" @{}
$review | Format-List
if ($review.score -ne 100 -or $review.status -ne "passed") { throw "IPC-CSI final review failed." }

Section "13. Final Certification"
$cert = PostJson "$root/certification/certify" @{
    approvedBy = "human:khalifa"
}
$cert | Format-List
if ($cert.status -ne "certified" -or $cert.score -ne 100) { throw "IPC-CSI certification failed." }

Section "Completed"
Write-Host "IPC-CSI MP1 passed all civilization-scale continuity layers and certification." -ForegroundColor Green