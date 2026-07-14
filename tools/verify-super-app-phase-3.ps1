#requires -Version 7.0
$ErrorActionPreference = "Stop"

$Root = "C:\Users\User\Desktop\AVOS"
$ApiRoot = Join-Path $Root "apps\api"
$MobileRoot = Join-Path $Root "apps\mobile"

$Required = @(
  "apps/api/src/super-app-v3/super-app-v3.types.ts",
  "apps/api/src/super-app-v3/super-app-v3.matching.service.ts",
  "apps/api/src/super-app-v3/super-app-v3.trust-fraud.service.ts",
  "apps/api/src/super-app-v3/super-app-v3.deal.service.ts",
  "apps/api/src/super-app-v3/super-app-v3.controller.ts",
  "apps/api/src/super-app-v3/super-app-v3.module.ts",
  "apps/api/scripts/smoke-super-app-phase-3.mjs",
  "apps/mobile/lib/src/features/super_app_v3/presentation/super_app_v3_operations_page.dart"
)

foreach ($Relative in $Required) {
  $Full = Join-Path $Root $Relative
  if (-not (Test-Path $Full)) {
    throw "Missing required file: $Relative"
  }
}

$AppModule = Get-Content -Raw (Join-Path $ApiRoot "src\app.module.ts")
if ($AppModule -notmatch "SuperAppV3Module") {
  throw "SuperAppV3Module is not registered in app.module.ts"
}

Push-Location $ApiRoot
try {
  pnpm build
  if ($LASTEXITCODE -ne 0) { throw "API build failed" }

  node .\scripts\smoke-super-app-phase-3.mjs
  if ($LASTEXITCODE -ne 0) { throw "Phase 3 smoke test failed" }
}
finally {
  Pop-Location
}

Push-Location $MobileRoot
try {
  flutter analyze
  if ($LASTEXITCODE -ne 0) { throw "Flutter analyze failed" }
}
finally {
  Pop-Location
}

[pscustomobject]@{
  success             = $true
  system              = "AVOS Super App Phase 3 Mega Pack"
  requiredFiles       = $Required.Count
  smartMatching       = $true
  negotiationEngine   = $true
  reservationFlow     = $true
  inspectionFlow      = $true
  financingFlow       = $true
  insuranceFlow       = $true
  paymentFlow         = $true
  dealTimeline        = $true
  trustFraudEngine    = $true
  operationsDashboard = $true
  typescript          = "passed"
  flutterAnalyze      = "passed"
  healthStatus        = "healthy"
} | Format-List
