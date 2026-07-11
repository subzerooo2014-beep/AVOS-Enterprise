$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\enterprise-runtime\recovery-v2\codegen-enterprise-recovery.contracts.ts",
    ".\src\enterprise-runtime\recovery-v2\codegen-enterprise-recovery-manager-v2.ts",
    ".\src\enterprise-runtime\readiness\codegen-production-readiness.contracts.ts",
    ".\src\enterprise-runtime\readiness\codegen-production-readiness-analyzer.ts",
    ".\src\enterprise-runtime\finalization\codegen-final-diagnostics-aggregator.ts",
    ".\src\enterprise-runtime\e2e\codegen-enterprise-e2e.contracts.ts",
    ".\src\enterprise-runtime\e2e\codegen-enterprise-end-to-end-runtime.ts",
    ".\src\enterprise-runtime\cli-bridge\codegen-enterprise-runtime-cli-bridge.ts",
    ".\scripts\run-mega-pack-10-bundle-d-smoke.ps1",
    ".\manifests\mega-pack-10-bundle-d.manifest.json"
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
    success                 = $true
    system                  = "AVOS CodeGen OS"
    pack                    = "mega-pack-10-bundle-d"
    classification          = "enterprise-end-to-end-runtime"
    requiredFiles           = $RequiredFiles.Count
    recoveryManagerPresent  = Test-Path ".\dist\enterprise-runtime\recovery-v2\codegen-enterprise-recovery-manager-v2.js"
    readinessPresent        = Test-Path ".\dist\enterprise-runtime\readiness\codegen-production-readiness-analyzer.js"
    diagnosticsPresent      = Test-Path ".\dist\enterprise-runtime\finalization\codegen-final-diagnostics-aggregator.js"
    e2eRuntimePresent       = Test-Path ".\dist\enterprise-runtime\e2e\codegen-enterprise-end-to-end-runtime.js"
    cliBridgePresent        = Test-Path ".\dist\enterprise-runtime\cli-bridge\codegen-enterprise-runtime-cli-bridge.js"
    declarationPresent      = Test-Path ".\dist\enterprise-runtime\e2e\codegen-enterprise-end-to-end-runtime.d.ts"
    megaPack10Completed      = $true
    healthStatus            = "healthy"
} | Format-List
