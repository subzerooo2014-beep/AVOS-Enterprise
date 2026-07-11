$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot

$RequiredFiles = @(
    "$Root\src\templates\codegen-template.contracts.ts",
    "$Root\src\templates\codegen-template-engine.ts",
    "$Root\src\blueprints\codegen-blueprint.contracts.ts",
    "$Root\src\blueprints\codegen-blueprint-registry.ts",
    "$Root\src\validation\codegen-validation.contracts.ts",
    "$Root\src\validation\codegen-validation-pipeline.ts",
    "$Root\src\cli\codegen-cli.contracts.ts",
    "$Root\src\cli\codegen-cli-command-registry.ts",
    "$Root\manifests\kernel-pack-3.manifest.json"
)

$Missing = @()

foreach ($File in $RequiredFiles) {
    if (-not (Test-Path $File)) {
        $Missing += $File
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AVOS CODEGEN OS — KERNEL PACK 3" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if ($Missing.Count -gt 0) {
    foreach ($File in $Missing) {
        Write-Host ("Missing: " + $File) -ForegroundColor Red
    }

    throw "Kernel Pack 3 verification failed."
}

$Index = Get-Content "$Root\src\index.ts" -Raw

$RequiredExports = @(
    "codegen-template-engine",
    "codegen-blueprint-registry",
    "codegen-validation-pipeline",
    "codegen-cli-command-registry"
)

foreach ($Export in $RequiredExports) {
    if (
        $Index -notmatch
        [regex]::Escape($Export)
    ) {
        throw "Missing public export: $Export"
    }
}

Write-Host "Template contracts created." -ForegroundColor Green
Write-Host "Template engine created." -ForegroundColor Green
Write-Host "Blueprint contracts created." -ForegroundColor Green
Write-Host "Blueprint registry created." -ForegroundColor Green
Write-Host "Validation contracts created." -ForegroundColor Green
Write-Host "Validation pipeline created." -ForegroundColor Green
Write-Host "CLI contracts created." -ForegroundColor Green
Write-Host "CLI command registry created." -ForegroundColor Green
Write-Host "Public exports updated." -ForegroundColor Green
Write-Host "Static verification passed." -ForegroundColor Green
Write-Host ""
Write-Host "Do NOT build yet." -ForegroundColor Yellow
Write-Host "Kernel Pack 3 completed." -ForegroundColor Green
