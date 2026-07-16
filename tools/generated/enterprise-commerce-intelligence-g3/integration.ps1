$ErrorActionPreference = "Stop"
& (Join-Path $PSScriptRoot "smoke.ps1")
& (Join-Path $PSScriptRoot "verify.ps1")
[pscustomobject]@{ success=$true; system="AVOS Enterprise Commerce Intelligence Mega Bundle G3"; integration="PASS" } | Format-List