$ErrorActionPreference = "Stop"

$Root =
    Split-Path `
        -Parent `
        $PSScriptRoot

$RequiredFiles = @(
    "$Root\package.json",
    "$Root\tsconfig.json",
    "$Root\src\index.ts",
    "$Root\src\core\codegen.contracts.ts",
    "$Root\src\core\codegen.errors.ts",
    "$Root\src\core\codegen-version.ts",
    "$Root\src\runtime\codegen-event-bus.ts",
    "$Root\src\registry\codegen-engine-registry.ts",
    "$Root\src\kernel\avos-codegen-kernel.ts"
)

$Missing = @()

foreach ($File in $RequiredFiles) {
    if (-not (Test-Path $File)) {
        $Missing += $File
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS CODEGEN OS — KERNEL PACK 1" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if ($Missing.Count -gt 0) {
    Write-Host "Missing files:" -ForegroundColor Red

    foreach ($File in $Missing) {
        Write-Host (" - " + $File) -ForegroundColor Red
    }

    throw "Kernel Pack 1 verification failed."
}

$KernelContent =
    Get-Content `
        "$Root\src\kernel\avos-codegen-kernel.ts" `
        -Raw

$RequiredKernelMembers = @(
    "initialize",
    "start",
    "stop",
    "registerEngine",
    "snapshot",
    "resolveEngineOrder"
)

foreach ($Member in $RequiredKernelMembers) {
    if (
        $KernelContent -notmatch
        [regex]::Escape($Member)
    ) {
        throw "Kernel member missing: $Member"
    }
}

$ContractsContent =
    Get-Content `
        "$Root\src\core\codegen.contracts.ts" `
        -Raw

$RequiredContracts = @(
    "CodeGenKernelStatus",
    "CodeGenEngineType",
    "CodeGenRuntimeContext",
    "CodeGenEngineDescriptor",
    "CodeGenEngine",
    "CodeGenEvent",
    "CodeGenKernelSnapshot"
)

foreach ($Contract in $RequiredContracts) {
    if (
        $ContractsContent -notmatch
        [regex]::Escape($Contract)
    ) {
        throw "Kernel contract missing: $Contract"
    }
}

Write-Host "Package foundation created." -ForegroundColor Green
Write-Host "TypeScript configuration created." -ForegroundColor Green
Write-Host "Kernel contracts created." -ForegroundColor Green
Write-Host "CodeGen error hierarchy created." -ForegroundColor Green
Write-Host "Semantic version utilities created." -ForegroundColor Green
Write-Host "Runtime event bus created." -ForegroundColor Green
Write-Host "Engine registry created." -ForegroundColor Green
Write-Host "CodeGen kernel created." -ForegroundColor Green
Write-Host "Public entry point created." -ForegroundColor Green
Write-Host "Static verification passed." -ForegroundColor Green
Write-Host ""
Write-Host "Do NOT build yet." -ForegroundColor Yellow
Write-Host "Kernel Pack 1 completed." -ForegroundColor Green
