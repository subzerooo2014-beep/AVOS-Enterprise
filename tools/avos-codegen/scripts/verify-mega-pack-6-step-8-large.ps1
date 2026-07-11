$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\cli\runtime\codegen-cli-runtime.contracts.ts",
    ".\src\cli\runtime\codegen-cli-runtime.ts",
    ".\src\cli\parsing\codegen-cli-argument-parser.ts",
    ".\src\cli\formatting\codegen-cli-output-formatter.ts",
    ".\src\cli\commands\codegen-help.command.ts",
    ".\src\cli\commands\codegen-doctor.command.ts",
    ".\src\cli\commands\codegen-list.command.ts",
    ".\src\cli\commands\codegen-inspect.command.ts",
    ".\src\cli\commands\codegen-preview.command.ts",
    ".\src\cli\commands\codegen-generate.command.ts",
    ".\src\cli\codegen-cli-entrypoint.ts",
    ".\src\cli\index.ts",
    ".\manifests\mega-pack-6-step-8-large.manifest.json"
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

$Manifest = Get-Content `
    ".\manifests\mega-pack-6-step-8-large.manifest.json" `
    -Raw |
ConvertFrom-Json

[PSCustomObject]@{
    success                 = $true
    system                  = $Manifest.system
    version                 = $Manifest.version
    pack                    = $Manifest.pack
    classification          = $Manifest.classification
    capabilities            = $Manifest.capabilities.Count
    requiredFiles           = $RequiredFiles.Count
    cliRuntimePresent       = Test-Path ".\dist\cli\runtime\codegen-cli-runtime.js"
    parserPresent           = Test-Path ".\dist\cli\parsing\codegen-cli-argument-parser.js"
    formatterPresent        = Test-Path ".\dist\cli\formatting\codegen-cli-output-formatter.js"
    helpCommandPresent      = Test-Path ".\dist\cli\commands\codegen-help.command.js"
    doctorCommandPresent    = Test-Path ".\dist\cli\commands\codegen-doctor.command.js"
    listCommandPresent      = Test-Path ".\dist\cli\commands\codegen-list.command.js"
    inspectCommandPresent   = Test-Path ".\dist\cli\commands\codegen-inspect.command.js"
    previewCommandPresent   = Test-Path ".\dist\cli\commands\codegen-preview.command.js"
    generateCommandPresent  = Test-Path ".\dist\cli\commands\codegen-generate.command.js"
    entrypointPresent       = Test-Path ".\dist\cli\codegen-cli-entrypoint.js"
    declarationPresent      = Test-Path ".\dist\cli\runtime\codegen-cli-runtime.d.ts"
    healthStatus            = "healthy"
} | Format-List
