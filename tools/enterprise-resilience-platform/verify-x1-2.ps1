[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-resilience-platform"

$Required = @(
  "enterprise-resilience.types.ts",
  "circuit-breaker-center.service.ts",
  "retry-framework.service.ts",
  "timeout-manager.service.ts",
  "rate-limiter.service.ts",
  "bulkhead-isolation.service.ts",
  "failover-router.service.ts",
  "adaptive-recovery.service.ts",
  "chaos-engineering.service.ts",
  "slo-sli-engine.service.ts",
  "enterprise-resilience-platform.service.ts",
  "enterprise-resilience-platform.controller.ts",
  "enterprise-resilience-platform.module.ts",
  "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) {
    $Missing += $File
  }
}

if ($Missing.Count -gt 0) {
  throw "Missing X1.2 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Circuits = Get-Content (Join-Path $Root "circuit-breaker-center.service.ts") -Raw
$Retries = Get-Content (Join-Path $Root "retry-framework.service.ts") -Raw
$Timeouts = Get-Content (Join-Path $Root "timeout-manager.service.ts") -Raw
$RateLimits = Get-Content (Join-Path $Root "rate-limiter.service.ts") -Raw
$Bulkheads = Get-Content (Join-Path $Root "bulkhead-isolation.service.ts") -Raw
$Failover = Get-Content (Join-Path $Root "failover-router.service.ts") -Raw
$Recovery = Get-Content (Join-Path $Root "adaptive-recovery.service.ts") -Raw
$Chaos = Get-Content (Join-Path $Root "chaos-engineering.service.ts") -Raw
$Slo = Get-Content (Join-Path $Root "slo-sli-engine.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-resilience-platform.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-resilience-platform.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseResiliencePlatformModule } from "./enterprise-resilience-platform/enterprise-resilience-platform.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseResiliencePlatformModule,'
  circuitBreakerCenter = $Circuits.Contains("canExecute(") -and $Circuits.Contains("failure(")
  retryFramework = $Retries.Contains("execute<T>(")
  timeoutManager = $Timeouts.Contains("Promise.race")
  rateLimiter = $RateLimits.Contains("consume(")
  bulkheadIsolation = $Bulkheads.Contains("maxConcurrency")
  failoverRouter = $Failover.Contains("resolve(group")
  adaptiveRecovery = $Recovery.Contains("execute<T>(")
  chaosEngineering = $Chaos.Contains("evaluate(target")
  sloSliEngine = $Slo.Contains("measure(")
  health = $Platform.Contains("health(): ResilienceHealth")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  circuitEndpoint = $Controller.Contains('@Post("circuit-breakers/:key")')
  retryEndpoint = $Controller.Contains('@Post("retry-policies")')
  timeoutEndpoint = $Controller.Contains('@Post("timeout-policies")')
  rateLimitEndpoint = $Controller.Contains('@Post("rate-limits/:key")')
  bulkheadEndpoint = $Controller.Contains('@Post("bulkheads/:key")')
  failoverEndpoint = $Controller.Contains('@Post("failover-targets")')
  chaosEndpoint = $Controller.Contains('@Post("chaos-experiments")')
  sloEndpoint = $Controller.Contains('@Post("slos")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($Failed.Count -gt 0) {
  throw "X1.2 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
  success = $true
  system = "AVOS Enterprise Resilience Platform"
  bundle = "X1.2"
  classification = "enterprise-resilience-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  circuitBreakerCenter = "enabled"
  retryFramework = "enabled"
  timeoutManager = "enabled"
  rateLimiter = "enabled"
  bulkheadIsolation = "enabled"
  failoverRouter = "enabled"
  adaptiveRecovery = "enabled"
  chaosEngineering = "enabled"
  sloSliEngine = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
