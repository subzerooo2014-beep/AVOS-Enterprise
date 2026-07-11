$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\templates\codegen-template.contracts.ts",
    ".\src\templates\codegen-template-engine.ts",
    ".\src\templates\codegen-template-runtime.ts",
    ".\src\templates\compiler\codegen-template-compiler.ts",
    ".\src\templates\compiler\codegen-template-renderer.ts",
    ".\src\templates\compiler\codegen-template-helper-registry.ts",
    ".\src\templates\loading\codegen-template-loader.ts",
    ".\src\templates\cache\codegen-template-cache.ts",
    ".\src\templates\catalog\codegen-template-catalog.ts",
    ".\src\templates\utilities\codegen-template-value.utilities.ts",
    ".\src\templates\index.ts",
    ".\templates\enterprise-module\module.template.json",
    ".\templates\enterprise-module\module.ts.hbs",
    ".\templates\enterprise-module\service.template.json",
    ".\templates\enterprise-module\service.ts.hbs",
    ".\manifests\production-mega-pack-5-part-1.manifest.json"
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
    ".\manifests\production-mega-pack-5-part-1.manifest.json" `
    -Raw |
ConvertFrom-Json

$TemplateManifests = @(
    Get-ChildItem `
        ".\templates" `
        -Recurse `
        -Filter "*.template.json"
)

$CompiledFiles = @(
    Get-ChildItem `
        ".\dist\templates" `
        -Recurse `
        -File `
        -ErrorAction SilentlyContinue
)

[PSCustomObject]@{
    success            = $true
    system             = $Manifest.system
    version            = $Manifest.version
    pack               = $Manifest.pack
    classification     = $Manifest.classification
    capabilities       = $Manifest.capabilities.Count
    requiredFiles      = $RequiredFiles.Count
    templateManifests  = $TemplateManifests.Count
    compiledFiles      = $CompiledFiles.Count
    compilerPresent    = Test-Path ".\dist\templates\compiler\codegen-template-compiler.js"
    rendererPresent    = Test-Path ".\dist\templates\compiler\codegen-template-renderer.js"
    loaderPresent      = Test-Path ".\dist\templates\loading\codegen-template-loader.js"
    cachePresent       = Test-Path ".\dist\templates\cache\codegen-template-cache.js"
    runtimePresent     = Test-Path ".\dist\templates\codegen-template-runtime.js"
    declarationPresent = Test-Path ".\dist\templates\codegen-template-runtime.d.ts"
    healthStatus       = "healthy"
} | Format-List
