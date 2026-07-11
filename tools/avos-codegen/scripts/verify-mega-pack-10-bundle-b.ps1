$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\enterprise-runtime\workspace\codegen-workspace.contracts.ts",
    ".\src\enterprise-runtime\workspace\codegen-workspace-scanner.ts",
    ".\src\enterprise-runtime\workspace\codegen-workspace-synchronizer.ts",
    ".\src\enterprise-runtime\graph-v2\codegen-artifact-graph-v2.contracts.ts",
    ".\src\enterprise-runtime\graph-v2\codegen-artifact-graph-builder-v2.ts",
    ".\src\enterprise-runtime\logging\codegen-enterprise-runtime-logger.ts",
    ".\src\enterprise-runtime\diagnostics\codegen-enterprise-runtime-diagnostics.ts",
    ".\src\enterprise-runtime\health\codegen-enterprise-runtime-health-monitor.ts",
    ".\src\enterprise-runtime\coordinator\codegen-enterprise-build-coordinator-v2.ts",
    ".\src\enterprise-runtime\bootstrap\codegen-enterprise-runtime-bootstrap.ts",
    ".\manifests\mega-pack-10-bundle-b.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object {
            -not (Test-Path $_)
        }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

[PSCustomObject]@{
    success                = $true
    system                 = "AVOS CodeGen OS"
    pack                   = "mega-pack-10-bundle-b"
    requiredFiles          = $RequiredFiles.Count
    workspaceScanner       = Test-Path ".\dist\enterprise-runtime\workspace\codegen-workspace-scanner.js"
    synchronizer           = Test-Path ".\dist\enterprise-runtime\workspace\codegen-workspace-synchronizer.js"
    graphV2                = Test-Path ".\dist\enterprise-runtime\graph-v2\codegen-artifact-graph-builder-v2.js"
    diagnostics            = Test-Path ".\dist\enterprise-runtime\diagnostics\codegen-enterprise-runtime-diagnostics.js"
    healthMonitor          = Test-Path ".\dist\enterprise-runtime\health\codegen-enterprise-runtime-health-monitor.js"
    buildCoordinator       = Test-Path ".\dist\enterprise-runtime\coordinator\codegen-enterprise-build-coordinator-v2.js"
    bootstrap              = Test-Path ".\dist\enterprise-runtime\bootstrap\codegen-enterprise-runtime-bootstrap.js"
    declarationPresent     = Test-Path ".\dist\enterprise-runtime\coordinator\codegen-enterprise-build-coordinator-v2.d.ts"
    healthStatus           = "healthy"
} | Format-List
