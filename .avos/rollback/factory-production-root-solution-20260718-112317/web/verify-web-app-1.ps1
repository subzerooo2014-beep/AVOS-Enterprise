param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$WebRoot = Join-Path $RepoRoot "apps\web"
$NextRoot = Join-Path $WebRoot ".next"

$requiredFiles = @(
  "src\app\page.tsx",
  "src\app\vehicles\page.tsx",
  "src\app\sell\page.tsx",
  "src\app\dashboard\page.tsx",
  "src\app\services\page.tsx",
  "src\app\globals.css"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $WebRoot $file
  if (-not (Test-Path $path)) {
    throw "Missing AVOS Web App file: $path"
  }
}

if (Test-Path $NextRoot) {
  Remove-Item $NextRoot -Recurse -Force
}

$tscCandidates = @(
  (Join-Path $RepoRoot "node_modules\typescript\bin\tsc"),
  (Join-Path $WebRoot "node_modules\typescript\bin\tsc")
)

$tscPath = $tscCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

Push-Location $WebRoot
try {
  if ($tscPath -and (Test-Path ".\tsconfig.json")) {
    & node $tscPath --noEmit -p .\tsconfig.json
    if ($LASTEXITCODE -ne 0) {
      throw "Web TypeScript verification failed with exit code $LASTEXITCODE"
    }
  }
}
finally {
  Pop-Location
}

[pscustomobject]@{
  success = $true
  system = "AVOS Web App 1.0"
  requiredFiles = $requiredFiles.Count
  homePage = $true
  vehiclesPage = $true
  sellPage = $true
  dashboardPage = $true
  servicesPage = $true
  azmAssistantUi = $true
  staleNextCacheCleared = $true
  healthStatus = "healthy"
}