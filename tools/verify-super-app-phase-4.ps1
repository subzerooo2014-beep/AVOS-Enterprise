$ErrorActionPreference = "Stop"

$Root = "C:\Users\User\Desktop\AVOS"
$ApiRoot = Join-Path $Root "apps\api"
$MobileRoot = Join-Path $Root "apps\mobile"

$Required = @(
  "apps/api/src/super-app-v4/super-app-v4.types.ts",
  "apps/api/src/super-app-v4/super-app-v4.partner-gateway.service.ts",
  "apps/api/src/super-app-v4/super-app-v4.webhook.service.ts",
  "apps/api/src/super-app-v4/super-app-v4.workflow.service.ts",
  "apps/api/src/super-app-v4/super-app-v4.controller.ts",
  "apps/api/src/super-app-v4/super-app-v4.module.ts",
  "apps/api/scripts/smoke-super-app-phase-4.mjs",
  "apps/mobile/lib/src/features/super_app_v4/presentation/super_app_v4_integrations_page.dart"
)

foreach ($Relative in $Required) {
  if (-not (Test-Path (Join-Path $Root $Relative))) {
    throw "Missing required file: $Relative"
  }
}

$AppModule = Get-Content -Raw (Join-Path $ApiRoot "src\app.module.ts")
if ($AppModule -notmatch "SuperAppV4Module") {
  throw "SuperAppV4Module is not registered in app.module.ts"
}

Push-Location $ApiRoot
try {
  pnpm build
  if ($LASTEXITCODE -ne 0) { throw "API build failed" }

  node .\scripts\smoke-super-app-phase-4.mjs
  if ($LASTEXITCODE -ne 0) { throw "Phase 4 smoke test failed" }
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
  success               = $true
  system                = "AVOS Super App Phase 4 Mega Pack"
  requiredFiles         = $Required.Count
  partnerGateway        = $true
  financeIntegration    = $true
  insuranceIntegration  = $true
  inspectionIntegration = $true
  paymentIntegration    = $true
  shippingIntegration   = $true
  exportIntegration     = $true
  webhooks              = $true
  retryHandling         = $true
  failureHandling       = $true
  integrationDashboard  = $true
  typescript            = "passed"
  flutterAnalyze        = "passed"
  healthStatus          = "healthy"
} | Format-List
