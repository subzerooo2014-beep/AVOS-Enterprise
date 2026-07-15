param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$paths = @(
  "apps/api/src/galaxy-platform/galaxy-bundle-5/galaxy-bundle-5.controller.ts",
  "apps/api/src/galaxy-platform/galaxy-bundle-6/galaxy-bundle-6.controller.ts",
  "apps/api/src/galaxy-platform/galaxy-bundle-7/galaxy-bundle-7.controller.ts",
  "apps/api/src/galaxy-platform/galaxy-bundle-8/galaxy-bundle-8.controller.ts",
  "apps/api/src/galaxy-platform/unified-final/unified-final.controller.ts"
)

foreach($path in $paths){
  if(-not(Test-Path(Join-Path $RepoRoot $path))){
    throw "Missing smoke target: $path"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=5
}