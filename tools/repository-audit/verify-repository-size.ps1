param(
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path,
    [long]$LimitBytes = 100MB
)

$ErrorActionPreference = "Stop"

Push-Location $Root
try {
    $gitRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
    if (-not $gitRoot) {
        throw "Not inside a Git repository: $Root"
    }

    $oversized = @()

    $trackedFiles = @(& git ls-files)

    foreach ($relativePath in $trackedFiles) {
        if ([string]::IsNullOrWhiteSpace($relativePath)) {
            continue
        }

        $fullPath = Join-Path $gitRoot $relativePath

        if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
            continue
        }

        $item = Get-Item -LiteralPath $fullPath

        if ($item.Length -ge $LimitBytes) {
            $oversized += [pscustomobject]@{
                Path   = $relativePath
                Length = $item.Length
                SizeMB = [math]::Round($item.Length / 1MB, 2)
            }
        }
    }

    if ($oversized.Count -gt 0) {
        $oversized | Sort-Object Length -Descending | Format-Table -AutoSize
        throw "Tracked repository files exist at or above GitHub's 100 MB limit."
    }

    [pscustomobject]@{
        success      = $true
        system       = "AVOS Repository Tracked-File Audit"
        verification = "PASS"
        trackedFiles = $trackedFiles.Count
        limitMB      = [math]::Round($LimitBytes / 1MB, 0)
    } | Format-List
}
finally {
    Pop-Location
}
