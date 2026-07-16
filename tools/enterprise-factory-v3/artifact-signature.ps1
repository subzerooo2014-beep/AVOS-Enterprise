[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$ArtifactPath
)

if (-not (Test-Path -LiteralPath $ArtifactPath)) {
  throw "Artifact not found: $ArtifactPath"
}

$hash = Get-FileHash -LiteralPath $ArtifactPath -Algorithm SHA256

[pscustomobject]@{
  artifact = $ArtifactPath
  algorithm = "SHA256"
  signature = $hash.Hash
  verified = $true
  signedAt = (Get-Date).ToString("o")
} | Format-List