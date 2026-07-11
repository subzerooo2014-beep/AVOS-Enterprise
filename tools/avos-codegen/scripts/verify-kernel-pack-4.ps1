$ErrorActionPreference = "Stop"

$Root =
    Split-Path `
        -Parent `
        $PSScriptRoot

$RequiredFiles = @(
    "$Root\src\filesystem\codegen-filesystem.contracts.ts",
    "$Root\src\filesystem\codegen-filesystem-engine.ts",
    "$Root\src\workspace\codegen-workspace-scanner.ts",
    "$Root\src\generators\codegen-generator.contracts.ts",
    "$Root\src\generators\codegen-generator-registry.ts",
    "$Root\src\generators\codegen-generator-engine.ts",
    "$Root\src\generators\enterprise-module.generator.ts",
    "$Root\src\pipeline\codegen-pipeline.contracts.ts",
    "$Root\src\pipeline\codegen-pipeline-executor.ts",
    "$Root\src\build\codegen-build-orchestrator.ts",
    "$Root\manifests\kernel-pack-4.manifest.json"
)

$Missing = @()

foreach ($File in $RequiredFiles) {
    if (-not (Test-Path $File)) {
        $Missing += $File
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS CODEGEN OS — KERNEL PACK 4" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if ($Missing.Count -gt 0) {
    foreach ($File in $Missing) {
        Write-Host ("Missing: " + $File) -ForegroundColor Red
    }

    throw "Kernel Pack 4 verification failed."
}

$Index =
    Get-Content `
        "$Root\src\index.ts" `
        -Raw

$RequiredExports = @(
    "codegen-filesystem-engine",
    "codegen-workspace-scanner",
    "codegen-generator-engine",
    "enterprise-module.generator",
    "codegen-pipeline-executor",
    "codegen-build-orchestrator"
)

foreach ($Export in $RequiredExports) {
    if (
        $Index -notmatch
        [regex]::Escape($Export)
    ) {
        throw "Missing public export: $Export"
    }
}

Write-Host "File system contracts created." -ForegroundColor Green
Write-Host "File system engine created." -ForegroundColor Green
Write-Host "Workspace scanner created." -ForegroundColor Green
Write-Host "Generator contracts created." -ForegroundColor Green
Write-Host "Generator registry created." -ForegroundColor Green
Write-Host "Generator engine created." -ForegroundColor Green
Write-Host "Pipeline contracts created." -ForegroundColor Green
Write-Host "Pipeline executor created." -ForegroundColor Green
Write-Host "Build orchestrator created." -ForegroundColor Green
Write-Host "Enterprise module generator created." -ForegroundColor Green
Write-Host "Public exports updated." -ForegroundColor Green
Write-Host "Static verification passed." -ForegroundColor Green
Write-Host ""
Write-Host "Do NOT build yet." -ForegroundColor Yellow
Write-Host "Kernel Pack 4 completed." -ForegroundColor Green
