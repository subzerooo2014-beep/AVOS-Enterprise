param(
    [Parameter(Mandatory = $true)]
    [string]$SpecificationPath
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$ResolvedSpecificationPath = Resolve-Path $SpecificationPath

node `
    ".\dist\genesis-engine-v2-cli\cli.js" `
    $ResolvedSpecificationPath

if ($LASTEXITCODE -ne 0) {
    throw "AVOS Genesis Engine v2 command failed."
}
