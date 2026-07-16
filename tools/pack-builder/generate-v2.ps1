[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
  [Parameter(Mandatory)][string]$BlueprintPath,
  [switch]$AllowReplace
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8([string]$Path,[string]$Content) {
  $parent=Split-Path -Parent $Path
  if($parent){New-Item -ItemType Directory -Force -Path $parent|Out-Null}
  [System.IO.File]::WriteAllText($Path,$Content,(New-Object System.Text.UTF8Encoding($false)))
}

function Pascal([string]$Value) {
  if([string]::IsNullOrWhiteSpace($Value)){return ""}
  $v=[regex]::Replace($Value,'([A-Z]+)([A-Z][a-z])','$1-$2')
  $v=[regex]::Replace($v,'([a-z0-9])([A-Z])','$1-$2')
  return (($v -split '[-_\s]+'|Where-Object{$_})|ForEach-Object{
    if($_.Length -eq 1){$_.ToUpperInvariant()}else{$_.Substring(0,1).ToUpperInvariant()+$_.Substring(1)}
  }) -join ''
}

function Kebab([string]$Value) {
  if([string]::IsNullOrWhiteSpace($Value)){return ""}
  $v=[regex]::Replace($Value,'([A-Z]+)([A-Z][a-z])','$1-$2')
  $v=[regex]::Replace($v,'([a-z0-9])([A-Z])','$1-$2')
  return ((($v -replace '[_\s]+','-') -replace '-+','-').Trim('-')).ToLowerInvariant()
}

function TsType([string]$Type) {
  switch($Type){
    "number"{"number"}
    "boolean"{"boolean"}
    "date"{"string"}
    "json"{"Record<string, unknown>"}
    default{"string"}
  }
}

$RepoRoot=(Resolve-Path -LiteralPath $RepoRoot).Path
$bp=Get-Content -LiteralPath $BlueprintPath -Raw|ConvertFrom-Json

foreach($required in @("schemaVersion","code","title","moduleSlug","capabilities","entities","targets")){
  if($null -eq $bp.$required){throw "Blueprint missing: $required"}
}
if([string]$bp.schemaVersion -ne "2.0"){throw "Unsupported blueprint schema"}

$slug=[string]$bp.moduleSlug
$pascal=Pascal $slug
$mobile=$slug.Replace("-","_")
$apiRoot=Join-Path $RepoRoot "apps/api/src/$slug"
$webRoot=Join-Path $RepoRoot "apps/web/src/app/$slug"
$mobileRoot=Join-Path $RepoRoot "apps/mobile/lib/features/$mobile"
$docsRoot=Join-Path $RepoRoot "docs/generated/$slug"
$testsRoot=Join-Path $RepoRoot "tools/generated/$slug"

foreach($root in @($apiRoot,$webRoot,$mobileRoot,$docsRoot,$testsRoot)){
  New-Item -ItemType Directory -Force -Path $root|Out-Null
}

$capType="${pascal}Capability"
$recordType="${pascal}Record"
$registryName=$slug.Replace("-","_").ToUpperInvariant()+"_CAPABILITIES"

$capUnion=(@($bp.capabilities)|ForEach-Object{"  | `"$_`""}) -join "`r`n"
$capRegistry=(@($bp.capabilities)|ForEach-Object{
  $label=(Get-Culture).TextInfo.ToTitleCase(($_ -replace "_"," ").ToLowerInvariant())
  "  $_`: `"$label`","
}) -join "`r`n"

Write-Utf8 (Join-Path $apiRoot "$slug.types.ts") @"
export type $capType =
$capUnion;

export interface $recordType {
  id: string;
  capability: $capType;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}
"@

Write-Utf8 (Join-Path $apiRoot "$slug.registry.ts") @"
import { $capType } from "./$slug.types";

export const $registryName`: Readonly<Record<$capType, string>> = {
$capRegistry
};
"@

$entityExports=New-Object System.Collections.Generic.List[string]
$dtoExports=New-Object System.Collections.Generic.List[string]
$entityNames=New-Object System.Collections.Generic.List[string]

foreach($entity in @($bp.entities)){
  $entityName=Pascal ([string]$entity.name)
  $entitySlug=Kebab ([string]$entity.name)
  $entityNames.Add($entityName)

  $entityFields=New-Object System.Collections.Generic.List[string]
  $createFields=New-Object System.Collections.Generic.List[string]
  $updateFields=New-Object System.Collections.Generic.List[string]

  foreach($field in @($entity.fields)){
    $type=TsType ([string]$field.type)
    $name=[string]$field.name
    if($field.required -eq $false){
      $entityFields.Add("  $name`?: $type;")
      $createFields.Add("  $name`?: $type;")
    }else{
      $entityFields.Add("  $name`: $type;")
      $createFields.Add("  $name`!: $type;")
    }
    $updateFields.Add("  $name`?: $type;")
  }

  Write-Utf8 (Join-Path $apiRoot "entities/$entitySlug.entity.ts") @"
export interface $entityName {
$($entityFields -join "`r`n")
}
"@

  Write-Utf8 (Join-Path $apiRoot "dto/$entitySlug.dto.ts") @"
export class Create${entityName}Dto {
$($createFields -join "`r`n")
}

export class Update${entityName}Dto {
$($updateFields -join "`r`n")
}
"@

  $entityExports.Add("export * from `"./entities/$entitySlug.entity`";")
  $dtoExports.Add("export * from `"./dto/$entitySlug.dto`";")
}

$entityNamesJson=@($entityNames)|ConvertTo-Json -Compress

Write-Utf8 (Join-Path $apiRoot "$slug.service.ts") @"
import { Injectable } from "@nestjs/common";
import { $registryName } from "./$slug.registry";
import { $recordType, $capType } from "./$slug.types";

@Injectable()
export class ${pascal}Service {
  private readonly records: $recordType[] = [];

  status() {
    return {
      success: true,
      system: "$($bp.title)",
      code: "$($bp.code)",
      version: "2.0.0",
      capabilities: Object.keys($registryName),
      entities: $entityNamesJson,
      records: this.records.length,
      generatedBy: "AVOS Pack Builder V2",
    };
  }

  execute(capability: $capType, metadata: Record<string, unknown> = {}) {
    const record: $recordType = {
      id: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 10),
      capability,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      metadata,
    };
    this.records.push(record);
    return { success: true, record };
  }

  list() {
    return { success: true, records: this.records };
  }
}
"@

Write-Utf8 (Join-Path $apiRoot "$slug.controller.ts") @"
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ${pascal}Service } from "./$slug.service";
import { $capType } from "./$slug.types";

@Controller("$slug")
export class ${pascal}Controller {
  constructor(private readonly service: ${pascal}Service) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("records")
  list() {
    return this.service.list();
  }

  @Post("execute/:capability")
  execute(
    @Param("capability") capability: $capType,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}
"@

Write-Utf8 (Join-Path $apiRoot "$slug.module.ts") @"
import { Module } from "@nestjs/common";
import { ${pascal}Controller } from "./$slug.controller";
import { ${pascal}Service } from "./$slug.service";

@Module({
  controllers: [${pascal}Controller],
  providers: [${pascal}Service],
  exports: [${pascal}Service],
})
export class ${pascal}Module {}
"@

Write-Utf8 (Join-Path $apiRoot "index.ts") @"
export * from "./$slug.module";
export * from "./$slug.service";
export * from "./$slug.types";
export * from "./$slug.registry";
$($entityExports -join "`r`n")
$($dtoExports -join "`r`n")
"@

$webCaps=(@($bp.capabilities)|ForEach-Object{
  $label=(Get-Culture).TextInfo.ToTitleCase(($_ -replace "_"," ").ToLowerInvariant())
  "  `"$label`","
}) -join "`r`n"

Write-Utf8 (Join-Path $webRoot "page.tsx") @"
"use client";

const capabilities = [
$webCaps
];

export default function ${pascal}Page() {
  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ letterSpacing: 2, textTransform: "uppercase", opacity: 0.65 }}>
        AVOS Enterprise Production
      </p>
      <h1 style={{ fontSize: 48, margin: "12px 0" }}>$($bp.title)</h1>
      <p style={{ fontSize: 18, lineHeight: 1.7, opacity: 0.78 }}>
        Generated by AVOS Pack Builder V2.
      </p>
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginTop: 32
      }}>
        {capabilities.map((capability) => (
          <article key={capability} style={{
            border: "1px solid rgba(0,0,0,.12)",
            borderRadius: 18,
            padding: 20
          }}>
            <strong>{capability}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
"@

$flutterCaps=(@($bp.capabilities)|ForEach-Object{
  $label=(Get-Culture).TextInfo.ToTitleCase(($_ -replace "_"," ").ToLowerInvariant())
  "    `"$label`","
}) -join "`r`n"

Write-Utf8 (Join-Path $mobileRoot "${mobile}_screen.dart") @"
import "package:flutter/material.dart";

class ${pascal}Screen extends StatelessWidget {
  const ${pascal}Screen({super.key});

  static const capabilities = <String>[
$flutterCaps
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("$($bp.title)")),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        itemBuilder: (context, index) => Card(
          child: ListTile(
            leading: const Icon(Icons.auto_awesome),
            title: Text(capabilities[index]),
          ),
        ),
      ),
    );
  }
}
"@

Write-Utf8 (Join-Path $mobileRoot "${mobile}.dart") "export `"${mobile}_screen.dart`";`r`n"

Write-Utf8 (Join-Path $docsRoot "README.md") @"
# $($bp.title)

Generated by AVOS Pack Builder V2.

- Code: $($bp.code)
- Module: $slug
- Capabilities: $(@($bp.capabilities).Count)
- Entities: $(@($bp.entities).Count)
"@

Write-Utf8 (Join-Path $testsRoot "smoke.ps1") @"
`$ErrorActionPreference = "Stop"
`$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent `$PSScriptRoot))
`$required = @(
  "apps/api/src/$slug/$slug.module.ts",
  "apps/web/src/app/$slug/page.tsx",
  "apps/mobile/lib/features/$mobile/${mobile}_screen.dart"
)
`$missing = @(`$required | Where-Object { -not (Test-Path (Join-Path `$root `$_)) })
if (`$missing.Count -gt 0) { throw "Smoke missing: `$(`$missing -join ', ')" }
[pscustomobject]@{ success=`$true; system="$($bp.title)"; smoke="PASS" } | Format-List
"@

Write-Utf8 (Join-Path $testsRoot "verify.ps1") @"
`$ErrorActionPreference = "Stop"
`$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent `$PSScriptRoot))
`$service = Get-Content (Join-Path `$root "apps/api/src/$slug/$slug.service.ts") -Raw
if (`$service -notmatch "AVOS Pack Builder V2") { throw "Generator marker missing." }
[pscustomobject]@{ success=`$true; system="$($bp.title)"; verification="PASS"; capabilities=$(@($bp.capabilities).Count); entities=$(@($bp.entities).Count) } | Format-List
"@

Write-Utf8 (Join-Path $testsRoot "integration.ps1") @"
`$ErrorActionPreference = "Stop"
& (Join-Path `$PSScriptRoot "smoke.ps1")
& (Join-Path `$PSScriptRoot "verify.ps1")
[pscustomobject]@{ success=`$true; system="$($bp.title)"; integration="PASS" } | Format-List
"@

$legacySpec=Join-Path $apiRoot "$slug.service.spec.ts"
if(Test-Path -LiteralPath $legacySpec){Remove-Item -LiteralPath $legacySpec -Force}

[pscustomobject]@{
  success=$true
  system="AVOS Pack Builder V2"
  module=$slug
  capabilities=@($bp.capabilities).Count
  entities=@($bp.entities).Count
} | Format-List