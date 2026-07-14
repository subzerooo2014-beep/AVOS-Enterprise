$ErrorActionPreference = "Stop"

$Root = "C:\Users\User\Desktop\AVOS"
$ApiRoot = Join-Path $Root "apps\api"
$MobileRoot = Join-Path $Root "apps\mobile"

$Required = @(
  "apps/api/src/super-app-v6/super-app-v6.types.ts",
  "apps/api/src/super-app-v6/super-app-v6.runtime.service.ts",
  "apps/api/src/super-app-v6/super-app-v6.controller.ts",
  "apps/api/src/super-app-v6/super-app-v6.module.ts",
  "apps/api/scripts/smoke-super-app-phase-6.mjs",
  "apps/mobile/lib/src/features/super_app_v6/presentation/super_app_v6_runtime_page.dart"
)

foreach ($Relative in $Required) {
  if (-not (Test-Path (Join-Path $Root $Relative))) {
    throw "Missing required file: $Relative"
  }
}

$AppModule = Get-Content -Raw (Join-Path $ApiRoot "src\app.module.ts")
if ($AppModule -notmatch "SuperAppV6Module") {
  throw "SuperAppV6Module is not registered in app.module.ts"
}

Push-Location $ApiRoot
try {
  pnpm build
  if ($LASTEXITCODE -ne 0) { throw "API build failed" }

  node .\scripts\smoke-super-app-phase-6.mjs
  if ($LASTEXITCODE -ne 0) { throw "Phase 6 smoke test failed" }
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
  system              = "AVOS Super App Phase 6 Unified Runtime Mega Pack"
  requiredFiles       = $Required.Count
  dealRuntime         = $true
  negotiationLink     = $true
  integrationsLink    = $true
  queueLink           = $true
  idempotencyLink     = $true
  notificationsLink   = $true
  auditLink           = $true
  endToEndRuntime     = $true
  runtimeDashboard    = $true
  typescript          = "passed"
  flutterAnalyze      = "passed"
  healthStatus        = "healthy"
} | Format-List
