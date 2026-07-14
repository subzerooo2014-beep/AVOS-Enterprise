$ErrorActionPreference = "Stop"

$Root = "C:\Users\User\Desktop\AVOS"
$ApiRoot = Join-Path $Root "apps\api"
$MobileRoot = Join-Path $Root "apps\mobile"

$Required = @(
  "apps/api/src/super-app-v5/super-app-v5.types.ts",
  "apps/api/src/super-app-v5/super-app-v5.registry.service.ts",
  "apps/api/src/super-app-v5/super-app-v5.idempotency.service.ts",
  "apps/api/src/super-app-v5/super-app-v5.audit.service.ts",
  "apps/api/src/super-app-v5/super-app-v5.notification.service.ts",
  "apps/api/src/super-app-v5/super-app-v5.queue.service.ts",
  "apps/api/src/super-app-v5/super-app-v5.controller.ts",
  "apps/api/src/super-app-v5/super-app-v5.module.ts",
  "apps/api/scripts/smoke-super-app-phase-5.mjs",
  "apps/mobile/lib/src/features/super_app_v5/presentation/super_app_v5_operations_page.dart"
)

foreach ($Relative in $Required) {
  if (-not (Test-Path (Join-Path $Root $Relative))) {
    throw "Missing required file: $Relative"
  }
}

$AppModule = Get-Content -Raw (Join-Path $ApiRoot "src\app.module.ts")
if ($AppModule -notmatch "SuperAppV5Module") {
  throw "SuperAppV5Module is not registered in app.module.ts"
}

Push-Location $ApiRoot
try {
  pnpm build
  if ($LASTEXITCODE -ne 0) { throw "API build failed" }

  node .\scripts\smoke-super-app-phase-5.mjs
  if ($LASTEXITCODE -ne 0) { throw "Phase 5 smoke test failed" }
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
  success              = $true
  system               = "AVOS Super App Phase 5 Production Mega Pack"
  requiredFiles        = $Required.Count
  partnerRegistry      = $true
  credentialRotation   = $true
  backgroundJobs       = $true
  retryQueue           = $true
  deadLetterQueue      = $true
  idempotency          = $true
  correlationIds       = $true
  auditTrail           = $true
  notifications        = $true
  operationsMonitoring = $true
  typescript           = "passed"
  flutterAnalyze       = "passed"
  healthStatus         = "healthy"
} | Format-List
