[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
    [string]$SmokeScript,
    [string]$IntegrationScript,
    [string]$VerificationScript,
    [switch]$SkipFlutterAnalyze,
    [switch]$SkipTests
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path

. (Join-Path $RepoRoot "tools/quality-gates/quality-gates.ps1")

$typescript = $null
$build = $null
$flutter = $null
$tests = $null
$smoke = $null
$integration = $null
$verification = $null

try {
    Write-Host "`n[1/6] TypeScript" -ForegroundColor Cyan
    $typescript = Invoke-AvosTypeScript -RepoRoot $RepoRoot

    Write-Host "`n[2/6] Workspace Build" -ForegroundColor Cyan
    $build = Invoke-AvosBuild -RepoRoot $RepoRoot

    Write-Host "`n[3/6] Flutter Analyze" -ForegroundColor Cyan
    $flutter = Invoke-AvosFlutterAnalyze `
        -RepoRoot $RepoRoot `
        -Skip:$SkipFlutterAnalyze

    Write-Host "`n[4/6] Workspace Tests" -ForegroundColor Cyan
    $tests = Invoke-AvosWorkspaceTests `
        -RepoRoot $RepoRoot `
        -Skip:$SkipTests

    Write-Host "`n[5/6] Smoke and Integration" -ForegroundColor Cyan

    $smoke = if ($SmokeScript) {
        Invoke-AvosScriptGate `
            -RepoRoot $RepoRoot `
            -ScriptPath $SmokeScript `
            -Name "Smoke Tests"
    }
    else {
        [pscustomobject]@{
            status = "NOT_APPLICABLE"
            name = "Smoke Tests"
        }
    }

    $integration = if ($IntegrationScript) {
        Invoke-AvosScriptGate `
            -RepoRoot $RepoRoot `
            -ScriptPath $IntegrationScript `
            -Name "Integration Tests"
    }
    else {
        [pscustomobject]@{
            status = "NOT_APPLICABLE"
            name = "Integration Tests"
        }
    }

    Write-Host "`n[6/6] Verification" -ForegroundColor Cyan

    $verification = if ($VerificationScript) {
        Invoke-AvosScriptGate `
            -RepoRoot $RepoRoot `
            -ScriptPath $VerificationScript `
            -Name "Verification"
    }
    else {
        [pscustomobject]@{
            status = "NOT_APPLICABLE"
            name = "Verification"
        }
    }
}
catch {
    Write-Host "`nQUALITY GATES FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    throw
}

[pscustomobject]@{
    success = $true
    typescript = $typescript.status
    build = $build.status
    flutterAnalyze = $flutter.status
    flutterExitCode = $flutter.exitCode
    flutterErrors = $flutter.errors
    flutterWarnings = $flutter.warnings
    flutterInfos = $flutter.infos
    tests = $tests.status
    testedPackages = $tests.tested
    skippedPackages = $tests.skipped
    smokeTests = $smoke.status
    integrationTests = $integration.status
    verification = $verification.status
} | Format-List