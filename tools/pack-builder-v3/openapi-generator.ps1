function New-OpenApiStubV3 {
  param(
    [Parameter(Mandatory)][string]$Title,
    [Parameter(Mandatory)][string]$ModuleSlug
  )

  return [ordered]@{
    openapi = "3.0.3"
    info = [ordered]@{
      title = $Title
      version = "3.0.0"
    }
    paths = [ordered]@{
      "/$ModuleSlug/status" = [ordered]@{
        get = [ordered]@{
          summary = "Get module status"
          responses = [ordered]@{
            "200" = [ordered]@{
              description = "Successful response"
            }
          }
        }
      }
    }
  }
}