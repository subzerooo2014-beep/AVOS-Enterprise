param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

Write-Host "Testing AVOS Software Development OS..." -ForegroundColor Cyan

$status = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/software-development-os/status"

if ($status.status -ne "operational") {
    throw "Software Development OS status is not operational."
}

$request = @{
    projectName = "AVOS Sample Enterprise Platform"
    vision = "Build a governed enterprise platform from a Living Blueprint."
    businessDomain = "enterprise-software"
    requestedBy = "human:khalifa"
    targetPlatforms = @("api", "web", "mobile")
    strategicChange = $true
} | ConvertTo-Json -Depth 10

$run = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/software-development-os/runs" `
    -ContentType "application/json" `
    -Body $request

if ($run.state -ne "awaiting-human-approval") {
    throw "Expected run to await Human Final Authority approval."
}

$approval = @{
    approvedBy = "human:khalifa"
} | ConvertTo-Json

$approved = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/software-development-os/runs/$($run.id)/approve" `
    -ContentType "application/json" `
    -Body $approval

$executed = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/software-development-os/runs/$($run.id)/execute"

$verified = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/software-development-os/runs/$($run.id)/verify"

$certified = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/software-development-os/runs/$($run.id)/certify" `
    -ContentType "application/json" `
    -Body $approval

Write-Host "Status        : $($status.status)" -ForegroundColor Green
Write-Host "Run ID        : $($run.id)" -ForegroundColor Green
Write-Host "Approved      : $($approved.state)" -ForegroundColor Green
Write-Host "Executed      : $($executed.state)" -ForegroundColor Green
Write-Host "Verified      : $($verified.state)" -ForegroundColor Green
Write-Host "Certified     : $($certified.state)" -ForegroundColor Green
Write-Host "Human Authority: $($certified.humanDecision)" -ForegroundColor Green