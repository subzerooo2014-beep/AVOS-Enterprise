$ErrorActionPreference = "Stop"
& (Join-Path $PSScriptRoot "smoke.ps1")
& (Join-Path $PSScriptRoot "verify.ps1")
[pscustomobject]@{ success=$true; system="AVOS Enterprise Global Operations Mega Bundle G2"; integration="PASS" } | Format-List