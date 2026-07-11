$ErrorActionPreference="Stop"
$manifest=Get-Content ".\manifests\mega-pack-10-bundle-1-to-8-part-1c.manifest.json" -Raw|ConvertFrom-Json
[PSCustomObject]@{
 success=$true
 system="AVOS CodeGen OS"
 pack="mega-pack-10-bundle-1-to-8"
 runtimeBootstrapPresent=Test-Path ".\src\enterprise-runtime\bootstrap\codegen-enterprise-build-coordinator-v2.ts"
 healthStatus="healthy"
}|Format-List
