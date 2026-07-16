[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
  [Parameter(Mandatory)][string]$BlueprintPath
)

$cacheRoot = Join-Path $RepoRoot "tools\enterprise-factory-v3\runtime\cache"
New-Item -ItemType Directory -Force -Path $cacheRoot | Out-Null

$hash = (Get-FileHash -LiteralPath $BlueprintPath -Algorithm SHA256).Hash
$cachePath = Join-Path $cacheRoot ($hash + ".json")

[pscustomobject]@{
  blueprint = $BlueprintPath
  fingerprint = $hash
  cachePath = $cachePath
  hit = Test-Path -LiteralPath $cachePath
} | Format-List