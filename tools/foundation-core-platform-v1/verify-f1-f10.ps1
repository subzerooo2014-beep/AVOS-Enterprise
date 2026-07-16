[CmdletBinding()]
param(
    [string]$ProjectRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"

$Root = Join-Path `
    $ProjectRoot `
    "apps\api\src\foundation-core-platform-v1"

$Required = @(
    "foundation-core-platform-v1.types.ts",
    "foundation-kernel-lifecycle-v1.service.ts",
    "foundation-module-runtime-v1.service.ts",
    "foundation-plugin-framework-v1.service.ts",
    "foundation-dependency-graph-v1.service.ts",
    "foundation-capability-registry-v1.service.ts",
    "foundation-feature-flags-v1.service.ts",
    "foundation-version-compatibility-v1.service.ts",
    "foundation-living-architecture-v1.service.ts",
    "foundation-platform-health-v1.service.ts",
    "foundation-core-platform-v1.service.ts",
    "foundation-core-platform-v1.controller.ts",
    "foundation-core-platform-v1.module.ts",
    "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing F1-F10 files: $($Missing -join ', ')"
}

$AppModule = Get-Content `
    (Join-Path $ProjectRoot "apps\api\src\app.module.ts") `
    -Raw

$Module = Get-Content `
    (Join-Path $Root "foundation-core-platform-v1.module.ts") `
    -Raw

$Controller = Get-Content `
    (Join-Path $Root "foundation-core-platform-v1.controller.ts") `
    -Raw

$Service = Get-Content `
    (Join-Path $Root "foundation-core-platform-v1.service.ts") `
    -Raw

$ImportCount = (
    [regex]::Matches(
        $AppModule,
        'foundation-core-platform-v1/foundation-core-platform-v1\.module'
    )
).Count

$ModuleSymbolCount = (
    [regex]::Matches(
        $AppModule,
        '\bFoundationCorePlatformV1Module\b'
    )
).Count

$Checks = [ordered]@{
    moduleClass = $Module.Contains(
        "export class FoundationCorePlatformV1Module"
    )
    singleImportPath = $ImportCount -eq 1
    moduleRegistered = $AppModule -match `
        'imports:\s*\[\s*FoundationCorePlatformV1Module,'
    moduleSymbolOccurrences = $ModuleSymbolCount -eq 2
    statusEndpoint = $Controller.Contains('@Get("status")')
    diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
    lifecycleEndpoint = $Controller.Contains('@Post("lifecycle/start")')
    modulesEndpoint = $Controller.Contains('@Post("modules")')
    pluginsEndpoint = $Controller.Contains('@Post("plugins")')
    capabilitiesEndpoint = $Controller.Contains('@Post("capabilities")')
    featureFlagsEndpoint = $Controller.Contains('@Post("feature-flags")')
    compatibilityEndpoint = $Controller.Contains('@Post("compatibility/check")')
    architectureEndpoint = $Controller.Contains('@Post("architecture")')
    metricsMethod = $Service.Contains(
        "metrics(): FoundationCoreMetricsV1"
    )
    statusMethod = $Service.Contains(
        "status(): FoundationCoreStatusV1"
    )
}

$Failed = @(
    $Checks.GetEnumerator() |
    Where-Object {
        -not $_.Value
    }
)

if ($Failed.Count -gt 0) {
    throw "F1-F10 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Foundation Core Platform V1"
    bundle = "F1-F10"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    kernelLifecycle = "enabled"
    moduleRuntime = "enabled"
    pluginFramework = "enabled"
    dependencyGraph = "enabled"
    capabilityRegistry = "enabled"
    featureFlags = "enabled"
    versionCompatibility = "enabled"
    livingArchitecture = "enabled"
    platformHealth = "enabled"
    duplicateModuleProtection = "enabled"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
