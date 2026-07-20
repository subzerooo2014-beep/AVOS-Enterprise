param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Assert-Equal {
    param($Actual, $Expected, [string]$Message)
    if ($Actual -ne $Expected) {
        throw "$Message Expected=[$Expected] Actual=[$Actual]"
    }
}

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) {
        throw $Message
    }
}

Write-Host ""
Write-Host "APCP Production Capability Integration Smoke Test" -ForegroundColor Cyan
Write-Host ("=" * 96) -ForegroundColor DarkGray

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/apcp-production-capability/status"

Assert-Equal ([string]$status.registration.status) "operational" "Capability is not operational."
Assert-Equal ([int]$status.certification.expectedDomains) 12 "Expected domain count mismatch."
Assert-Equal ([int]$status.certification.verifiedDomains) 12 "Verified domain count mismatch."
Assert-Equal ([int]$status.certification.score) 100 "Certification score mismatch."
Assert-Equal ([int]$status.certification.risk) 0 "Risk mismatch."
Assert-True ([bool]$status.certification.deploymentAllowed) "Deployment is not allowed."
Assert-True ([bool]$status.certification.digitalTwinReady) "Digital twin is not ready."

$descriptor = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/apcp-production-capability/factory/descriptor"

Assert-Equal ([string]$descriptor.orchestrationMode) "adapter" "Factory adapter mode mismatch."
Assert-True ([bool]$descriptor.requiresHumanApproval) "Human approval is not required."

$body = @{
    approvedBy = "human:khalifa"
    score = 100
    risk = 0
} | ConvertTo-Json

$factory = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/apcp-production-capability/factory/execute" `
    -ContentType "application/json" `
    -Body $body

Assert-True ([bool]$factory.accepted) "Factory execution was rejected."

$contribution = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/apcp-production-capability/unified-certification/contribution"

Assert-True ([bool]$contribution.certified) "Unified certification contribution is not certified."
Assert-Equal ([int]$contribution.score) 100 "Unified certification score mismatch."
Assert-Equal (@($contribution.blockingIssues).Count) 0 "Blocking issues were detected."
Assert-True ([bool]$contribution.globalComplianceReady) "Global compliance readiness failed."

$e2e = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/apcp-production-capability/e2e/run" `
    -ContentType "application/json" `
    -Body (@{ approvedBy = "human:khalifa" } | ConvertTo-Json)

Assert-Equal ([string]$e2e.status) "passed" "E2E integration failed."
Assert-True ([bool]$e2e.checks.factoryBridge) "Factory bridge failed."
Assert-True ([bool]$e2e.checks.unifiedCertificationBridge) "Unified certification bridge failed."
Assert-True ([bool]$e2e.checks.humanFinalAuthority) "Human Final Authority failed."
Assert-True ([bool]$e2e.checks.globalComplianceReadinessGate) "Compliance readiness gate failed."

Write-Host ""
Write-Host "APCP PRODUCTION CAPABILITY INTEGRATION SUCCESS" -ForegroundColor Green
Write-Host "Capability registration       : operational" -ForegroundColor Green
Write-Host "Factory integration           : passed" -ForegroundColor Green
Write-Host "Unified certification         : certified" -ForegroundColor Green
Write-Host "Evidence domains              : 12/12" -ForegroundColor Green
Write-Host "Certification score           : 100" -ForegroundColor Green
Write-Host "Risk                          : 0" -ForegroundColor Green
Write-Host "Deployment                    : allowed" -ForegroundColor Green
Write-Host "Digital twin                  : ready" -ForegroundColor Green
Write-Host "Human Final Authority         : enforced" -ForegroundColor Green
Write-Host "Global Compliance Ready Gate  : passed" -ForegroundColor Green
Write-Host ("=" * 96) -ForegroundColor DarkGray