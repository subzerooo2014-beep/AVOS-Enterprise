param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$ApprovedBy = "human:khalifa"
)

$ErrorActionPreference = "Stop"

function Assert-Equal {
    param(
        [string]$Name,
        $Actual,
        $Expected
    )

    if ($Actual -ne $Expected) {
        throw "$Name failed. Expected [$Expected], received [$Actual]."
    }
}

Write-Host ""
Write-Host "AVOS Software Development OS — Ultimate Mega Pack Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod 
    -Method Get 
    -Uri "$BaseUrl/avos/software-development-os/ultimate/status"

$status | Format-List
Assert-Equal "Operational status" $status.status "operational"
Assert-Equal "Health score" $status.score 100
Assert-Equal "Foundation First" $status.foundationFirst $true
Assert-Equal "Capability First" $status.capabilityFirst $true
Assert-Equal "Human Final Authority" $status.humanFinalAuthority $true
Assert-Equal "Global Compliance Readiness Gate" $status.globalComplianceReadinessGate $true
Assert-Equal "Continuous Self Evolution" $status.integratedLifecycle.continuousSelfEvolution $true

$review = Invoke-RestMethod 
    -Method Get 
    -Uri "$BaseUrl/avos/software-development-os/ultimate/review"

$review | Format-List
Assert-Equal "Final review" $review.status "passed"
Assert-Equal "Final review score" $review.score 100

$evolution = Invoke-RestMethod 
    -Method Get 
    -Uri "$BaseUrl/avos/software-development-os/ultimate/evolution-plan"

$evolution | Format-List
Assert-Equal "Evolution status" $evolution.status "active"
Assert-Equal "Evolution human authority" $evolution.humanFinalAuthority $true

$body = @{ approvedBy = $ApprovedBy } | ConvertTo-Json
$certification = Invoke-RestMethod 
    -Method Post 
    -Uri "$BaseUrl/avos/software-development-os/ultimate/certify" 
    -ContentType "application/json" 
    -Body $body

$certification | Format-List
Assert-Equal "Certification status" $certification.status "certified"
Assert-Equal "Certification score" $certification.score 100
Assert-Equal "Certification approver" $certification.approvedBy $ApprovedBy

Write-Host ""
Write-Host "AVOS Software Development OS Ultimate Mega Pack smoke passed." -ForegroundColor Green
