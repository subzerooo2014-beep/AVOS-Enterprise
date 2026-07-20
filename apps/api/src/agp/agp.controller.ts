import { Body, Controller, Get, Post } from "@nestjs/common";
import { AgpCertificationService } from "./agp-certification.service";
import { AgpConstitutionService } from "./agp-constitution.service";
import { AgpHealthService } from "./agp-health.service";
import { AgpMapsService } from "./agp-maps.service";

@Controller("avos/agp/mega-pack-0")
export class AgpController {
  constructor(
    private readonly constitution: AgpConstitutionService,
    private readonly maps: AgpMapsService,
    private readonly health: AgpHealthService,
    private readonly certification: AgpCertificationService,
  ) {}

  @Get("status") getStatus() { return this.health.status(); }
  @Get("architecture-review") getArchitectureReview() { return this.constitution.reviewArchitecture(); }
  @Get("gap-analysis") getGapAnalysis() { return this.constitution.getGapAnalysis(); }
  @Get("maps") getMaps() { return this.maps.all(); }
  @Get("maps/capabilities") getCapabilityMap() { return this.maps.capabilityMap(); }
  @Get("maps/services") getServiceMap() { return this.maps.serviceMap(); }
  @Get("maps/engines") getEngineMap() { return this.maps.engineMap(); }
  @Get("maps/data") getDataMap() { return this.maps.dataMap(); }
  @Get("maps/integrations") getIntegrationMap() { return this.maps.integrationMap(); }
  @Get("roadmap") getRoadmap() { return this.maps.roadmap(); }
  @Post("certification/certify") certify(@Body() body: { approvedBy: string }) { return this.certification.certify(body.approvedBy); }
  @Get("certification/status") certificationStatus() { return this.certification.status(); }
}