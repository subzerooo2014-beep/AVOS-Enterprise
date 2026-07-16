function New-PluginManifestV3 {
  param(
    [Parameter(Mandatory)][string]$Name,
    [Parameter(Mandatory)][string]$Version,
    [Parameter(Mandatory)][string[]]$Capabilities
  )

  [pscustomobject]@{
    name = $Name
    version = $Version
    capabilities = $Capabilities
    generatedAt = (Get-Date).ToString("o")
    generatedBy = "AVOS Pack Builder V3"
  }
}