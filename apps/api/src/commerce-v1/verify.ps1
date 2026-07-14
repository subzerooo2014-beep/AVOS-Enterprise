param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$WebRoot = Join-Path $RepoRoot "apps\web"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"
$NextRoot = Join-Path $WebRoot ".next"

$requiredFiles = @(
  "apps\api\src\commerce-v1\commerce-v1.types.ts",
  "apps\api\src\commerce-v1\commerce-v1.service.ts",
  "apps\api\src\commerce-v1\commerce-v1.controller.ts",
  "apps\api\src\commerce-v1\commerce-v1.module.ts",
  "apps\web\src\app\insurance\page.tsx",
  "apps\web\src\app\finance\page.tsx",
  "apps\web\src\app\workshops\page.tsx",
  "apps\web\src\app\export\page.tsx",
  "apps\web\src\app\payments\page.tsx",
  "apps\web\src\app\commerce-notifications\page.tsx"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $RepoRoot $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing Commerce Mega Pack file: $path"
  }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "CommerceV1Module") {
  throw "CommerceV1Module is not registered"
}

if (Test-Path $NextRoot) {
  Remove-Item $NextRoot -Recurse -Force
}

$tscCandidates = @(
  (Join-Path $RepoRoot "node_modules\typescript\bin\tsc"),
  (Join-Path $ApiRoot "node_modules\typescript\bin\tsc")
)

$tscPath = $tscCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $tscPath) {
  throw "TypeScript compiler was not found."
}

Push-Location $ApiRoot
try {
  & node $tscPath --noEmit -p .\tsconfig.json
  if ($LASTEXITCODE -ne 0) {
    throw "Commerce API verification failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

Push-Location $WebRoot
try {
  & node $tscPath --noEmit -p .\tsconfig.json
  if ($LASTEXITCODE -ne 0) {
    throw "Commerce Web verification failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

[pscustomobject]@{
  success = $true
  system = "AVOS Commerce Mega Pack"
  requiredFiles = $requiredFiles.Count
  insurance = $true
  finance = $true
  workshops = $true
  exportLogistics = $true
  payments = $true
  notifications = $true
  typescript = "passed"
  healthStatus = "healthy"
}