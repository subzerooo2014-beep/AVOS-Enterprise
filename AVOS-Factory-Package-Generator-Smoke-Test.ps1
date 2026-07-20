param(
  [string]$BaseUrl = 'http://localhost:3000',
  [string]$RepoRoot = 'C:\Users\User\Desktop\AVOS'
)

$ErrorActionPreference = 'Stop'
$base = "$BaseUrl/avos/factory/package-generator"

$status = Invoke-RestMethod -Method Get -Uri "$base/status"

if ($status.version -ne 'PG-1.0.0') {
  throw 'Unexpected Package Generator version.'
}
if ($status.status -ne 'operational') {
  throw 'Package Generator is not operational.'
}
if (-not $status.foundationFirst) {
  throw 'Foundation First is not preserved.'
}
if (-not $status.capabilityFirst) {
  throw 'Capability First is not preserved.'
}
if (-not $status.blueprintDriven) {
  throw 'Blueprint Driven is not preserved.'
}
if (-not $status.humanFinalAuthority) {
  throw 'Human Final Authority is not preserved.'
}
if (-not $status.globalComplianceReadinessGate) {
  throw 'Global Compliance Readiness Gate is not preserved.'
}

$body = @{ repoRoot = $RepoRoot } | ConvertTo-Json

$result = Invoke-RestMethod `
  -Method Post `
  -Uri "$base/generate/aeos-mega-pack-2" `
  -ContentType 'application/json' `
  -Body $body

if ($result.execution.status -ne 'generated') {
  throw 'AEOS Mega Pack 2 generation failed.'
}
if (-not $result.execution.typeCheckPassed) {
  throw 'Generated package TypeScript verification failed.'
}
if (-not $result.execution.buildPassed) {
  throw 'Generated package Nest build failed.'
}
if ($result.certification.status -ne 'certified') {
  throw 'Generated package certification failed.'
}
if ($result.certification.score -ne 100) {
  throw 'Generated package certification score is not 100.'
}

Write-Host ''
Write-Host 'AVOS Factory Package Generator Smoke Test : passed' -ForegroundColor Green
Write-Host "Generator Version                         : $($status.version)"
Write-Host "Generated Package                         : $($result.execution.packageName)"
Write-Host "Generated Version                         : $($result.execution.packageVersion)"
Write-Host "Generated Files                           : $($result.execution.generatedFiles.Count)"
Write-Host "TypeScript                                : passed"
Write-Host "Nest Build                                : passed"
Write-Host "Certification                             : certified"
Write-Host "Score                                     : 100"
Write-Host "Human Final Authority                     : preserved"
Write-Host "Global Compliance Gate                    : preserved"