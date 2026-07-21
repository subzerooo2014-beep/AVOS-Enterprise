param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Assert-True([bool]$Condition, [string]$Message) {
    if (-not $Condition) {
        throw "Assertion failed: $Message"
    }
}

Write-Host "Testing AVOS Mobility Ultimate Mega Pack 1..." -ForegroundColor Cyan

$status = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/mobility/ultimate-mega-pack-1/status"
Assert-True ($status.status -eq "operational") "status must be operational"
Assert-True ($status.productionLaunch -eq $true) "productionLaunch must be true"
Assert-True ($status.foundationRebuild -eq $false) "foundation must not be rebuilt"
Assert-True ($status.foundationIntegration.humanFinalAuthority -eq $true) "Human Final Authority required"
Assert-True ($status.foundationIntegration.globalComplianceReadinessGate -eq $true) "Global compliance gate required"

$dealerBody = @{
    name = "AVOS Mobility Demo Dealer"
    countryCode = "AE"
    city = "Dubai"
    verified = $true
} | ConvertTo-Json

$dealer = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/mobility/dealers" `
    -ContentType "application/json" `
    -Body $dealerBody

$vehicleBody = @{
    make = "Toyota"
    model = "Land Cruiser"
    year = 2025
    mileageKm = 1200
    condition = "certified"
    priceAmount = 285000
    currency = "AED"
    dealerId = $dealer.id
    city = "Dubai"
    countryCode = "AE"
} | ConvertTo-Json

$vehicle = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/mobility/vehicles" `
    -ContentType "application/json" `
    -Body $vehicleBody

$listingBody = @{
    vehicleId = $vehicle.id
    sellerType = "dealer"
    sellerId = $dealer.id
    title = "2025 Toyota Land Cruiser Certified"
    description = "Created by AVOS Mobility UMP1 smoke test."
} | ConvertTo-Json

$listing = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/mobility/listings" `
    -ContentType "application/json" `
    -Body $listingBody

$approvalBody = @{
    approvedBy = "human:khalifa"
} | ConvertTo-Json

$published = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/mobility/listings/$($listing.id)/publish" `
    -ContentType "application/json" `
    -Body $approvalBody

Assert-True ($published.status -eq "published") "listing must be published"

$search = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/mobility/vehicles?make=Toyota&countryCode=AE"

Assert-True ($search.Count -ge 1) "vehicle search must return at least one record"

$aiBody = @{
    id = $vehicle.id
    year = 2025
    mileageKm = 1200
    condition = "certified"
    currency = "AED"
} | ConvertTo-Json

$assessment = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/mobility/ai/price-assessment" `
    -ContentType "application/json" `
    -Body $aiBody

Assert-True ($assessment.requiresHumanApproval -eq $true) "AI output must require human approval"

$readiness = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/mobility/ultimate-mega-pack-1/readiness"

Assert-True ($readiness.score -eq 100) "readiness score must be 100"
Assert-True ($readiness.state -eq "ready") "readiness state must be ready"

Write-Host ""
Write-Host "AVOS Mobility Ultimate Mega Pack 1 smoke test PASSED." -ForegroundColor Green
Write-Host "Readiness score: $($readiness.score)"
Write-Host "Vehicle ID: $($vehicle.id)"
Write-Host "Dealer ID : $($dealer.id)"
Write-Host "Listing ID: $($listing.id)"