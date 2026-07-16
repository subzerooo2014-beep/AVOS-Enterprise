$ErrorActionPreference = "Stop"

$Root = "C:\Users\User\Desktop\AVOS"
$Api = Join-Path $Root "apps\api"

Write-Host "============================================================"
Write-Host "AVOS Foundation Consolidation Pack 1"
Write-Host "Foundation Control Plane"
Write-Host "============================================================"

$ModulePath = Join-Path $Api "src\foundation-control-plane"

New-Item -ItemType Directory -Force -Path $ModulePath | Out-Null
New-Item -ItemType Directory -Force -Path "$ModulePath\registry" | Out-Null
New-Item -ItemType Directory -Force -Path "$ModulePath\dto" | Out-Null

@'
import { Injectable } from "@nestjs/common";

@Injectable()
export class FoundationControlPlaneService {
  private readonly foundations = [
    "constitutional-foundation",
    "foundation-core",
    "foundation-governance",
    "enterprise-metadata-platform",
    "explainability-trust-platform",
    "enterprise-reliability-observability-core"
  ];

  status() {
    return {
      system: "AVOS Foundation Control Plane",
      status: "healthy",
      foundations: this.foundations.length,
      registry: "active"
    };
  }

  registry() {
    return {
      total: this.foundations.length,
      items: this.foundations
    };
  }

  health() {
    return {
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}
'@ | Set-Content "$ModulePath\foundation-control-plane.service.ts" -Encoding UTF8

@'
import { Controller, Get } from "@nestjs/common";
import { FoundationControlPlaneService } from "./foundation-control-plane.service";

@Controller("foundation-control")
export class FoundationControlPlaneController {
  constructor(private readonly service: FoundationControlPlaneService) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("registry")
  registry() {
    return this.service.registry();
  }

  @Get("health")
  health() {
    return this.service.health();
  }
}
'@ | Set-Content "$ModulePath\foundation-control-plane.controller.ts" -Encoding UTF8

@'
import { Module } from "@nestjs/common";
import { FoundationControlPlaneController } from "./foundation-control-plane.controller";
import { FoundationControlPlaneService } from "./foundation-control-plane.service";

@Module({
  controllers: [FoundationControlPlaneController],
  providers: [FoundationControlPlaneService],
  exports: [FoundationControlPlaneService]
})
export class FoundationControlPlaneModule {}
'@ | Set-Content "$ModulePath\foundation-control-plane.module.ts" -Encoding UTF8

@'
export const AVOS_FOUNDATION_REGISTRY = [
  "constitutional-foundation",
  "foundation-core",
  "foundation-governance",
  "enterprise-metadata-platform",
  "explainability-trust-platform",
  "enterprise-reliability-observability-core"
];
'@ | Set-Content "$ModulePath\registry\foundation-registry.ts" -Encoding UTF8

@'
export class FoundationStatusDto {
  system!: string;
  status!: string;
  foundations!: number;
}
'@ | Set-Content "$ModulePath\dto\foundation-status.dto.ts" -Encoding UTF8

Write-Host "Foundation Control Plane files created."
Write-Host "Next:"
Write-Host "cd apps/api"
Write-Host "pnpm build"