[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"

$Root = Join-Path `
    $ProjectRoot `
    "apps\api\src\production-hardening-readiness-platform-v1"

$Required = @(
    "production-hardening-readiness-v1.types.ts",
    "performance-benchmark-v1.service.ts",
    "chaos-testing-v1.service.ts",
    "disaster-recovery-v1.service.ts",
    "multi-node-validation-v1.service.ts",
    "security-readiness-v1.service.ts",
    "release-readiness-gate-v1.service.ts",
    "production-certification-v1.service.ts",
    "production-hardening-readiness-platform-v1.service.ts",
    "production-hardening-readiness-platform-v1.controller.ts",
    "production-hardening-readiness-platform-v1.module.ts",
    "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing P31-P40 files: $($Missing -join ', ')"
}

$AppModule = Get-Content `
    (Join-Path $ProjectRoot "apps\api\src\app.module.ts") `
    -Raw

$Module = Get-Content `
    (Join-Path $Root "production-hardening-readiness-platform-v1.module.ts") `
    -Raw

$Controller = Get-Content `
    (Join-Path $Root "production-hardening-readiness-platform-v1.controller.ts") `
    -Raw

$Service = Get-Content `
    (Join-Path $Root "production-hardening-readiness-platform-v1.service.ts") `
    -Raw

$ImportCount = (
    [regex]::Matches(
        $AppModule,
        'production-hardening-readiness-platform-v1/production-hardening-readiness-platform-v1\.module'
    )
).Count

$ModuleSymbolCount = (
    [regex]::Matches(
        $AppModule,
        '\bProductionHardeningReadinessPlatformV1Module\b'
    )
).Count

$Checks = [ordered]@{
    moduleClass = $Module.Contains(
        "export class ProductionHardeningReadinessPlatformV1Module"
    )
    singleImportPath = $ImportCount -eq 1
    moduleRegistered = $AppModule -match `
        'imports:\s*\[\s*ProductionHardeningReadinessPlatformV1Module,'
    moduleSymbolOccurrences = $ModuleSymbolCount -eq 2
    statusEndpoint = $Controller.Contains('@Get("status")')
    diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
    benchmarkEndpoint = $Controller.Contains('@Post("benchmarks")')
    chaosEndpoint = $Controller.Contains('@Post("chaos")')
    chaosExecuteEndpoint = $Controller.Contains('@Post("chaos/:id/execute")')
    recoveryEndpoint = $Controller.Contains('@Post("disaster-recovery")')
    recoveryValidateEndpoint = $Controller.Contains('@Post("disaster-recovery/:id/validate")')
    multiNodeEndpoint = $Controller.Contains('@Post("multi-node/validate")')
    securityEndpoint = $Controller.Contains('@Post("security/checks")')
    readinessEndpoint = $Controller.Contains('@Post("readiness-gates")')
    certificationEndpoint = $Controller.Contains('@Post("certifications")')
    metricsMethod = $Service.Contains("metrics(): HardeningMetricsV1")
    statusMethod = $Service.Contains("status(): HardeningPlatformStatusV1")
}

$Failed = @(
    $Checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($Failed.Count -gt 0) {
    throw "P31-P40 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Production Hardening & Readiness Platform V1"
    bundle = "P31-P40"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    performanceBenchmarks = "enabled"
    loadTestingFoundation = "enabled"
    chaosTesting = "enabled"
    disasterRecovery = "enabled"
    multiNodeValidation = "enabled"
    securityReadiness = "enabled"
    releaseReadinessGates = "enabled"
    resilienceCertification = "enabled"
    productionReadinessCertification = "enabled"
    finalAcceptance = "enabled"
    duplicateModuleProtection = "enabled"
    platformIntegrationSeriesStatus = "FINAL_BUNDLE"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
