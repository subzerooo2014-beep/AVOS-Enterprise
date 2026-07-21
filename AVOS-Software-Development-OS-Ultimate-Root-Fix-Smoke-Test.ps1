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

$status = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/software-development-os/ultimate/status"
$status | Format-List

Assert-Equal "Status" $status.status "operational"
Assert-Equal "Score" $status.score 100
Assert-Equal "Organization OS" $status.organizationOS $true
Assert-Equal "Engineering Brain" $status.engineeringBrain $true
Assert-Equal "Continuous Self Evolution" $status.continuousSelfEvolution $true
Assert-Equal "Human Final Authority" $status.humanFinalAuthority $true
Assert-Equal "Global Compliance Readiness Gate" $status.globalComplianceReadinessGate $true

$review = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/software-development-os/ultimate/review"
Assert-Equal "Review" $review.status "passed"
Assert-Equal "Review score" $review.score 100

$body = @{ approvedBy = $ApprovedBy } | ConvertTo-Json
$certification = Invoke-RestMethod 
    -Method Post 
    -Uri "$BaseUrl/avos/software-development-os/ultimate/certify" 
    -ContentType "application/json" 
    -Body $body

$certification | Format-List
Assert-Equal "Certification" $certification.status "certified"
Assert-Equal "Certification score" $certification.score 100
Assert-Equal "Approved by" $certification.approvedBy $ApprovedBy

Write-Host ""
Write-Host "AVOS Software Development OS Ultimate root-fix smoke passed." -ForegroundColor Green
