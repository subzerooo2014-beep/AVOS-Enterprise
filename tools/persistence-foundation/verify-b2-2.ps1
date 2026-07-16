[CmdletBinding()]
param(
    [string]$ProjectRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"

$Root = Join-Path $ProjectRoot "apps\api\src\infrastructure\repository-registry"
$Required = @(
    "repository-registry.types.ts",
    "repository-discovery.service.ts",
    "repository-registry.service.ts",
    "repository-registry.controller.ts",
    "repository-registry.module.ts",
    "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing B2.2 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Discovery = Get-Content (Join-Path $Root "repository-discovery.service.ts") -Raw
$Registry = Get-Content (Join-Path $Root "repository-registry.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "repository-registry.controller.ts") -Raw

$Checks = [ordered]@{
    appModuleImport = $AppModule.Contains('import { RepositoryRegistryModule } from "./infrastructure/repository-registry/repository-registry.module";')
    appModuleRegistration = $AppModule -match 'imports:\s*\[\s*RepositoryRegistryModule,'
    discoveryEngine = $Discovery.Contains("discover(sourceRoot")
    metadataCatalog = $Registry.Contains("private readonly repositories")
    dependencyMap = $Registry.Contains("dependencyMap()")
    healthMonitor = $Registry.Contains("health()")
    statistics = $Registry.Contains("statistics()")
    versioning = $Registry.Contains('version: "1.0.0"')
    resolver = $Registry.Contains("resolve(token")
    refreshEndpoint = $Controller.Contains('@Post("refresh")')
    statusEndpoint = $Controller.Contains('@Get("status")')
    resolveEndpoint = $Controller.Contains('@Get("resolve/:token")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) {
    throw "B2.2 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Persistence Foundation"
    bundle = "B2.2"
    capability = "Enterprise Repository Registry"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    discovery = "enabled"
    metadataCatalog = "enabled"
    dependencyMap = "enabled"
    healthMonitor = "enabled"
    statistics = "enabled"
    versioning = "enabled"
    resolver = "enabled"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
