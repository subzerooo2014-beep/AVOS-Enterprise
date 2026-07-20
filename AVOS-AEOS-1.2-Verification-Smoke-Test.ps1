$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000/avos/aeos/strategy-decision-intelligence'

$status = Invoke-RestMethod -Method Get -Uri "$base/status"
$verification = Invoke-RestMethod -Method Post -Uri "$base/verify"
$certification = Invoke-RestMethod -Method Post -Uri "$base/certify"
$dashboard = Invoke-RestMethod -Method Get -Uri "$base/dashboard"

if ($status.version -ne 'AEOS-1.2.0') { throw 'Unexpected AEOS version.' }
if ($status.status -ne 'operational') { throw 'AEOS-1.2 is not operational.' }
if ($status.score -ne 100) { throw 'AEOS-1.2 status score is not 100.' }
if ($verification.status -ne 'passed') { throw 'AEOS-1.2 verification failed.' }
if ($certification.status -ne 'certified') { throw 'AEOS-1.2 certification failed.' }
if (-not $status.humanFinalAuthority) { throw 'Human Final Authority was not preserved.' }
if (-not $status.globalComplianceReadinessGate) { throw 'Global Compliance Gate was not preserved.' }
if ($dashboard.version -ne 'AEOS-1.2.0') { throw 'Dashboard version mismatch.' }

Write-Host 'AEOS-1.2 Verification Smoke Test : passed' -ForegroundColor Green
Write-Host "Version                           : $($status.version)"
Write-Host "Status                            : $($status.status)"
Write-Host "Score                             : $($verification.score)"
Write-Host "Certification                     : $($certification.status)"
Write-Host 'Human Final Authority             : preserved'
Write-Host 'Global Compliance Gate            : preserved'