[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
    [switch]$SkipFlutterAnalyze
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
. (Join-Path $RepoRoot "tools/quality-gates/quality-gates.ps1")

$typescript = Invoke-AvosTypeScript -RepoRoot $RepoRoot
$build = Invoke-AvosBuild -RepoRoot $RepoRoot
$flutter = Invoke-AvosFlutterAnalyze `
    -RepoRoot $RepoRoot `
    -Skip:$SkipFlutterAnalyze
$tests = Invoke-AvosWorkspaceTests -RepoRoot $RepoRoot

[pscustomobject]@{
    success = $true
    typescript = $typescript.status
    build = $build.status
    flutterAnalyze = $flutter.status
    flutterExitCode = $flutter.exitCode
    flutterErrors = $flutter.errors
    flutterWarnings = $flutter.warnings
    flutterInfos = $flutter.infos
    workspaceTests = $tests.status
    testedPackages = $tests.tested
    skippedPackages = $tests.skipped
    failedPackages = $tests.failed
} | Format-List