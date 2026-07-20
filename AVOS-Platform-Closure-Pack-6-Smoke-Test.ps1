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

Write-Host "AVOS Platform Closure Pack 6 - Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-6/status"

Assert-True ($status.status -eq "operational") "Pack 6 is not operational."
Assert-True ($status.controls.unifiedCrossPackReview -eq $true) "Unified review control missing."
Assert-True ($status.controls.globalComplianceReadinessGate -eq $true) "Compliance gate missing."

$review = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-6/review"

Assert-True ($review.status -eq "passed") "Closure review failed."
Assert-True ($review.score -eq 100) "Closure review score is not 100."
Assert-True ($review.blockingIssues.Count -eq 0) "Closure review contains blockers."

$readiness = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-6/production-readiness"

Assert-True ($readiness.status -eq "ready") "Platform is not production ready."
Assert-True ($readiness.score -eq 100) "Production readiness score is not 100."
Assert-True ($readiness.blockers.Count -eq 0) "Production readiness contains blockers."

$certificationBody = @{
    approvedBy = "human:khalifa"
} | ConvertTo-Json

$certification = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-6/certification/certify" `
    -ContentType "application/json" `
    -Body $certificationBody

Assert-True ($certification.status -eq "certified") "Platform certification failed."
Assert-True ($certification.score -eq 100) "Certification score is not 100."
Assert-True ($certification.approvedBy -eq "human:khalifa") "Certification approver mismatch."
Assert-True ($certification.checks.noBlockingIssues -eq $true) "Blocking issue check failed."
Assert-True ($certification.checks.globalComplianceReadinessGate -eq $true) "Compliance check failed."

$finalStatus = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-6/status"

Assert-True ($finalStatus.platformState -eq "certified") "Platform state is not certified."

Write-Host ""
Write-Host "Smoke Test Passed" -ForegroundColor Green
Write-Host ("Review ID            : {0}" -f $review.id)
Write-Host ("Review Score         : {0}" -f $review.score)
Write-Host ("Readiness ID         : {0}" -f $readiness.id)
Write-Host ("Readiness Score      : {0}" -f $readiness.score)
Write-Host ("Certification ID     : {0}" -f $certification.id)
Write-Host ("Certification Status : {0}" -f $certification.status)
Write-Host ("Certification Score  : {0}" -f $certification.score)
Write-Host ("Approved By          : {0}" -f $certification.approvedBy)
Write-Host ("Platform State       : {0}" -f $finalStatus.platformState)