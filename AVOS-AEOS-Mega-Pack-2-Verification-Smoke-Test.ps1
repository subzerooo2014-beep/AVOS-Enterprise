param(
  [string]$BaseUrl = 'http://localhost:3000',
  [string]$ApprovedBy = 'human:khalifa'
)

$ErrorActionPreference = 'Stop'

function Assert-True([bool]$Condition, [string]$Message) {
  if (-not $Condition) { throw $Message }
}

Write-Host ''
Write-Host ('=' * 80) -ForegroundColor DarkCyan
Write-Host 'AEOS Mega Pack 2 — Runtime Verification Smoke Test' -ForegroundColor Cyan
Write-Host ('=' * 80) -ForegroundColor DarkCyan

$status = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/aeos/mega-pack-2/status"
Assert-True ($status.version -eq 'AEOS-2.0.0') 'Unexpected AEOS version.'
Assert-True ($status.status -eq 'operational') 'AEOS Mega Pack 2 is not operational.'
Assert-True ($status.stages.Count -eq 7) 'Expected 7 AEOS stages.'

$body = @{
  objective = 'Validate unified autonomous enterprise intelligence'
  requestedBy = $ApprovedBy
  jurisdiction = 'global'
} | ConvertTo-Json

$execution = Invoke-RestMethod `
  -Method Post `
  -Uri "$BaseUrl/avos/aeos/mega-pack-2/execute" `
  -ContentType 'application/json' `
  -Body $body

Assert-True ($execution.aggregateScore -eq 100) 'Unified runtime score is not 100.'
Assert-True ($execution.stages.Count -eq 7) 'Unified runtime did not execute all stages.'
Assert-True ($execution.humanFinalAuthority -eq $true) 'Human Final Authority not preserved.'
Assert-True ($execution.globalComplianceReadinessGate -eq $true) 'Global Compliance Gate not preserved.'

$verification = Invoke-RestMethod `
  -Method Post `
  -Uri "$BaseUrl/avos/aeos/mega-pack-2/verification/run"

Assert-True ($verification.status -eq 'passed') 'Unified verification failed.'
Assert-True ($verification.score -eq 100) 'Unified verification score is not 100.'

$readiness = Invoke-RestMethod `
  -Method Get `
  -Uri "$BaseUrl/avos/aeos/mega-pack-2/production-readiness"

Assert-True ($readiness.status -eq 'ready') 'Production readiness failed.'
Assert-True ($readiness.score -eq 100) 'Production readiness score is not 100.'

$certBody = @{ approvedBy = $ApprovedBy } | ConvertTo-Json
$certification = Invoke-RestMethod `
  -Method Post `
  -Uri "$BaseUrl/avos/aeos/mega-pack-2/certification/certify" `
  -ContentType 'application/json' `
  -Body $certBody

Assert-True ($certification.status -eq 'certified') 'AEOS-2.0 certification failed.'
Assert-True ($certification.score -eq 100) 'AEOS-2.0 certification score is not 100.'
Assert-True ($certification.checks.humanFinalAuthority -eq $true) 'Certification lost Human Final Authority.'
Assert-True ($certification.checks.globalComplianceReadinessGate -eq $true) 'Certification lost Global Compliance Gate.'

Write-Host ''
Write-Host 'AEOS Mega Pack 2 Verification Smoke Test : passed' -ForegroundColor Green
Write-Host 'Version                                    : AEOS-2.0.0' -ForegroundColor Green
Write-Host 'Stages                                     : AEOS-1.3 through AEOS-1.9' -ForegroundColor Green
Write-Host 'Status                                     : operational' -ForegroundColor Green
Write-Host 'Score                                      : 100' -ForegroundColor Green
Write-Host 'Certification                              : certified' -ForegroundColor Green
Write-Host 'Production Readiness                       : ready' -ForegroundColor Green
Write-Host 'Human Final Authority                      : preserved' -ForegroundColor Green
Write-Host 'Global Compliance Gate                     : preserved' -ForegroundColor Green