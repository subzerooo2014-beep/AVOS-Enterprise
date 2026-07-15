#requires -Version 7.0
[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8([string]$Path, [string]$Content) {
    [System.IO.File]::WriteAllText(
        $Path,
        $Content.Replace("`r`n", "`n"),
        [System.Text.UTF8Encoding]::new($false)
    )
}

$controllersRoot = Join-Path $RepoRoot "apps/api/src/platform-os-v2/controllers"
$toolsRoot = Join-Path $RepoRoot "tools/verification/mega-system-1-platform-os"

foreach ($file in Get-ChildItem $controllersRoot -Filter "*-platform.controller.ts" -File) {
    $content = Get-Content $file.FullName -Raw

    $content = $content.Replace(
        'throw new Error(Unknown capability: ${capability});',
        'throw new Error(`Unknown capability: ${capability}`);'
    )

    $content = [regex]::Replace(
        $content,
        'return Object\.entries\(this\.services\(\)\)\.map\(\s*\(\[capability,\s*service\]\)\s*=>\s*\(\{\s*capability,\s*\.\.\.service\.health\(\),\s*\}\),\s*\);',
        "return Object.values(this.services()).map((service) =>`n      service.health(),`n    );"
    )

    Write-Utf8 $file.FullName $content
}

foreach ($name in @(
    "smoke-platform-os-v2.mjs",
    "integration-platform-os-v2.mjs"
)) {
    $path = Join-Path $toolsRoot $name
    $content = Get-Content $path -Raw

    $content = $content.Replace(
        'throw new Error(Compiled file not found: ${name});',
        'throw new Error(`Compiled file not found: ${name}`);'
    )

    Write-Utf8 $path $content
}

Write-Host "Mega System 1 repair generator completed." -ForegroundColor Green