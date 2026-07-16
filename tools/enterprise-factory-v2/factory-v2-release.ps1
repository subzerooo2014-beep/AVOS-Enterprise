[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$ArtifactPath,
  [ValidateSet("DEV","STAGING","PRODUCTION")][string]$Channel = "DEV"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $ArtifactPath)) {
  throw "Artifact not found: $ArtifactPath"
}

[pscustomobject]@{
  success = $true
  artifact = $ArtifactPath
  channel = $Channel
  status = "PROMOTED"
  promotedAt = (Get-Date).ToString("o")
} | Format-List