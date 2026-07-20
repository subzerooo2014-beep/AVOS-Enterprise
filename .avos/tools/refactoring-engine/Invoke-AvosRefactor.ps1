param(
    [Parameter(Mandatory = $true)]
    [string]$ConfigPath
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$global:LASTEXITCODE = 0

$enginePath = Join-Path $PSScriptRoot "avos-refactor-engine.cjs"

if (-not (Test-Path $enginePath)) {
    throw "AVOS Refactoring Engine was not found."
}

if (-not (Test-Path $ConfigPath)) {
    throw "Refactoring config was not found: $ConfigPath"
}

& node $enginePath $ConfigPath

if ($LASTEXITCODE -ne 0) {
    throw "AVOS Refactoring Engine failed with exit code $LASTEXITCODE."
}