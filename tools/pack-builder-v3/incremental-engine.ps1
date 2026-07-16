function Get-FileFingerprintV3 {
  param([Parameter(Mandatory)][string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    return $null
  }

  return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash
}

function Test-GenerationRequiredV3 {
  param(
    [Parameter(Mandatory)][string]$Path,
    [Parameter(Mandatory)][string]$ExpectedContent
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return $true
  }

  $existing = Get-Content -LiteralPath $Path -Raw
  return $existing -ne $ExpectedContent
}