$ErrorActionPreference = "Stop"

$Root =
    Split-Path `
        -Parent `
        $PSScriptRoot

$RequiredFiles = @(
    "$Root\src\configuration\codegen-configuration-engine.ts",
    "$Root\src\manifest\codegen-manifest-engine.ts",
    "$Root\src\plugins\codegen-plugin-registry.ts",
    "$Root\src\diagnostics\codegen-runtime-diagnostics.ts",
    "$Root\src\kernel\codegen-runtime-container.ts",
    "$Root\config\codegen.defaults.json",
    "$Root\manifests\avos-codegen-system.manifest.json",
    "$Root\manifests\kernel-pack-2.manifest.json"
)

$Missing = @()

foreach ($File in $RequiredFiles) {
    if (-not (Test-Path $File)) {
        $Missing += $File
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS CODEGEN OS — KERNEL PACK 2" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if ($Missing.Count -gt 0) {
    Write-Host "Missing files:" -ForegroundColor Red

    foreach ($File in $Missing) {
        Write-Host (" - " + $File) -ForegroundColor Red
    }

    throw "Kernel Pack 2 verification failed."
}

$Contracts =
    Get-Content `
        "$Root\src\core\codegen.contracts.ts" `
        -Raw

$RequiredContracts = @(
    "CodeGenConfigurationSource",
    "CodeGenManifestType",
    "CodeGenPluginStatus",
    "CodeGenDiagnosticLevel",
    "CodeGenConfigurationEntry",
    "CodeGenManifest",
    "CodeGenPluginDescriptor",
    "CodeGenDiagnosticRecord"
)

foreach ($Contract in $RequiredContracts) {
    if (
        $Contracts -notmatch
        [regex]::Escape($Contract)
    ) {
        throw "Missing Kernel Pack 2 contract: $Contract"
    }
}

$Index =
    Get-Content `
        "$Root\src\index.ts" `
        -Raw

$RequiredExports = @(
    "codegen-configuration-engine",
    "codegen-manifest-engine",
    "codegen-plugin-registry",
    "codegen-runtime-diagnostics",
    "codegen-runtime-container"
)

foreach ($Export in $RequiredExports) {
    if (
        $Index -notmatch
        [regex]::Escape($Export)
    ) {
        throw "Missing public export: $Export"
    }
}

Write-Host "Configuration engine created." -ForegroundColor Green
Write-Host "Manifest engine created." -ForegroundColor Green
Write-Host "Plugin registry created." -ForegroundColor Green
Write-Host "Plugin dependency resolver created." -ForegroundColor Green
Write-Host "Runtime diagnostics created." -ForegroundColor Green
Write-Host "Runtime container created." -ForegroundColor Green
Write-Host "Default configuration created." -ForegroundColor Green
Write-Host "System manifest created." -ForegroundColor Green
Write-Host "Static verification passed." -ForegroundColor Green
Write-Host ""
Write-Host "Do NOT build yet." -ForegroundColor Yellow
Write-Host "Kernel Pack 2 completed." -ForegroundColor Green
