function New-TypeScriptApiClientV3 {
  param(
    [Parameter(Mandatory)][string]$ModuleSlug,
    [Parameter(Mandatory)][string]$ClassName
  )

  return @"
export class $ClassName {
  constructor(private readonly baseUrl: string) {}

  async status(): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/$ModuleSlug/status`);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return response.json();
  }
}
"@
}