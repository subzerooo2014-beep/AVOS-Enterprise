param(
    [string]$BaseUrl = "http://localhost:3000"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Section([string]$Title) {
    Write-Host ""
    Write-Host ("=" * 110) -ForegroundColor DarkCyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host ("=" * 110) -ForegroundColor DarkCyan
}

Section "1. Runtime Status"
$status = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/global-production-os/status"
$status | Format-List

Section "2. Factory Registry"
$factories = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/global-production-os/factories"
$factories | Format-Table id,name,region,countryCode,status,healthScore,trustScore

Section "3. Create Workload"
$workloadBody = @{
    objective = "Deploy a globally compliant AVOS enterprise product"
    requiredCapabilities = @("software-factory")
    preferredRegions = @("middle-east","europe")
    prohibitedCountries = @()
    dataClassification = "confidential"
    requestedCapacity = 50
    maximumCostIndex = 90
    maximumCarbonIndex = 70
    requiresHumanApproval = $true
} | ConvertTo-Json -Depth 10

$workload = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/workloads" `
    -ContentType "application/json" `
    -Body $workloadBody
$workload | Format-List

Section "4. Geo-aware Route"
$route = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/workloads/$($workload.id)/route"
$route | Format-List

Section "5. Human Approval"
$approval = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/workloads/$($workload.id)/approve" `
    -ContentType "application/json" `
    -Body '{"approved":true}'
$approval | Format-List

Section "6. Replication"
$targets = @($factories | Where-Object { $_.id -ne $route.selectedFactoryId } | Select-Object -First 2 -ExpandProperty id)
$replicationBody = @{
    workloadId = $workload.id
    targetFactoryIds = $targets
    strategy = "active-passive"
} | ConvertTo-Json -Depth 10
$replication = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/replication/plan" `
    -ContentType "application/json" `
    -Body $replicationBody
$replication | Format-List

Section "7. Disaster Recovery"
$recoveryBody = @{
    primaryFactoryId = $route.selectedFactoryId
    recoveryFactoryIds = $targets
    rpoMinutes = 5
    rtoMinutes = 15
} | ConvertTo-Json -Depth 10
$recovery = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/recovery/plans" `
    -ContentType "application/json" `
    -Body $recoveryBody
$recovery | Format-List

Section "8. Intelligence Forecast"
$forecast = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/intelligence/forecast" `
    -ContentType "application/json" `
    -Body '{"horizonHours":24}'
$forecast | Format-List

Section "9. Marketplace"
$offerBody = @{
    factoryId = $route.selectedFactoryId
    capability = "software-factory"
    availableCapacity = 100
    unitCost = 42
} | ConvertTo-Json
$offer = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/marketplace/offers" `
    -ContentType "application/json" `
    -Body $offerBody
$offer | Format-List

Section "10. Economy and Digital Twin"
$economy = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/global-production-os/economy/snapshot"
$twin = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/global-production-os/digital-twin/snapshot"
$economy | Format-List
$twin | Format-List

Section "11. Evolution Proposal"
$proposalBody = @{
    title = "Adaptive Regional Capacity Expansion"
    rationale = "Increase resilience and reduce predicted global saturation."
    expectedImpact = 88
    riskLevel = "medium"
} | ConvertTo-Json
$proposal = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/evolution/proposals" `
    -ContentType "application/json" `
    -Body $proposalBody
$proposal | Format-List

$decisionBody = @{
    approved = $true
    approvedBy = "human:khalifa"
} | ConvertTo-Json
$decision = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/evolution/$($proposal.id)/decide" `
    -ContentType "application/json" `
    -Body $decisionBody
$decision | Format-List

$deployment = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/evolution/$($proposal.id)/deploy"
$deployment | Format-List

Section "12. Final Review"
$review = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/final-review/run"
$review | Format-List

Section "13. Certification"
$certification = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/global-production-os/certification/certify" `
    -ContentType "application/json" `
    -Body '{"approvedBy":"human:khalifa"}'
$certification | Format-List

if ($review.status -ne "passed" -or $review.score -ne 100) {
    throw "Final review did not pass with 100."
}
if ($certification.status -ne "certified" -or $certification.score -ne 100) {
    throw "Certification did not complete with 100."
}

Section "Completed"
Write-Host "AVOS Global Production Operating System passed all ten layers and certification." -ForegroundColor Green