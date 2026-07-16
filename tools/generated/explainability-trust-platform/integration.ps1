$ErrorActionPreference = "Stop"
& (Join-Path $PSScriptRoot "smoke.ps1")
& (Join-Path $PSScriptRoot "verify.ps1")
[pscustomobject]@{ success=$true; system="AVOS Explainability and Trust Platform"; integration="PASS" } | Format-List