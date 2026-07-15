[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
. (Join-Path $RepoRoot "tools/quality-gates/quality-gates.ps1")

try {
    Write-Host "`n[1/4] TypeScript" -ForegroundColor Cyan
    $typescript = Invoke-AvosTypeScript -RepoRoot $RepoRoot

    Write-Host "`n[2/4] Workspace Build" -ForegroundColor Cyan
    $build = Invoke-AvosBuild -RepoRoot $RepoRoot

    Write-Host "`n[3/4] Flutter Analyze" -ForegroundColor Cyan
    $flutter = Invoke-AvosFlutterAnalyze -RepoRoot $RepoRoot

    Write-Host "`n[4/4] Workspace Tests" -ForegroundColor Cyan
    $tests = Invoke-AvosWorkspaceTests -RepoRoot $RepoRoot

    if (
        $null -eq $typescript -or
        $null -eq $build -or
        $null -eq $flutter -or
        $null -eq $tests
    ) {
        throw "One or more quality gate result objects are null."
    }

    [pscustomobject]@{
        success = $true
        typescript = [string]$typescript.status
        build = [string]$build.status
        flutterAnalyze = [string]$flutter.status
        flutterExitCode = [int]$flutter.exitCode
        flutterErrors = [int]$flutter.errors
        flutterWarnings = [int]$flutter.warnings
        flutterInfos = [int]$flutter.infos
        workspaceTests = [string]$tests.status
        testedPackages = [int]$tests.tested
        skippedPackages = [int]$tests.skipped
        failedPackages = [int]$tests.failed
    } | Format-List
}
catch {
    Write-Host "`nQUALITY GATES FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    throw
}