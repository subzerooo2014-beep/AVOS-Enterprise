$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\planning\graph\codegen-dependency-graph.contracts.ts",
    ".\src\planning\graph\codegen-dependency-graph.ts",
    ".\src\planning\algorithms\codegen-graph-cycle-detector.ts",
    ".\src\planning\algorithms\codegen-topological-sorter.ts",
    ".\src\planning\analysis\codegen-graph-depth-analyzer.ts",
    ".\src\planning\analysis\codegen-critical-path-analyzer.ts",
    ".\src\planning\analysis\codegen-dependency-graph-analyzer.ts",
    ".\src\planning\diagnostics\codegen-graph-diagnostics.ts",
    ".\src\planning\visualization\codegen-dependency-graph-dot-renderer.ts",
    ".\src\planning\engine\codegen-graph-planning-adapter.ts",
    ".\manifests\mega-pack-7-step-2-large.manifest.json"
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
    ".\manifests\mega-pack-7-step-2-large.manifest.json" `
    -Raw |
ConvertFrom-Json

[PSCustomObject]@{
    success                  = $true
    system                   = $Manifest.system
    version                  = $Manifest.version
    pack                     = $Manifest.pack
    classification           = $Manifest.classification
    capabilities             = $Manifest.capabilities.Count
    requiredFiles            = $RequiredFiles.Count
    graphPresent             = Test-Path ".\dist\planning\graph\codegen-dependency-graph.js"
    cycleDetectorPresent     = Test-Path ".\dist\planning\algorithms\codegen-graph-cycle-detector.js"
    sorterPresent            = Test-Path ".\dist\planning\algorithms\codegen-topological-sorter.js"
    depthAnalyzerPresent     = Test-Path ".\dist\planning\analysis\codegen-graph-depth-analyzer.js"
    criticalPathPresent      = Test-Path ".\dist\planning\analysis\codegen-critical-path-analyzer.js"
    analyzerPresent          = Test-Path ".\dist\planning\analysis\codegen-dependency-graph-analyzer.js"
    diagnosticsPresent       = Test-Path ".\dist\planning\diagnostics\codegen-graph-diagnostics.js"
    dotRendererPresent       = Test-Path ".\dist\planning\visualization\codegen-dependency-graph-dot-renderer.js"
    adapterPresent           = Test-Path ".\dist\planning\engine\codegen-graph-planning-adapter.js"
    declarationPresent       = Test-Path ".\dist\planning\graph\codegen-dependency-graph.d.ts"
    healthStatus             = "healthy"
} | Format-List
