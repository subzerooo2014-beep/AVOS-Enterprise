import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { LinkDependencyDto, RegisterMetadataDto, UpdateMetadataDto } from "./dto/enterprise-metadata.dto";
import { MetadataCertificationService } from "./services/metadata-certification.service";
import { DependencyGraphService } from "./services/dependency-graph.service";
import { MetadataGovernanceService } from "./services/metadata-governance.service";
import { MetadataHealthService } from "./services/metadata-health.service";
import { MetadataRegistryService } from "./services/metadata-registry.service";

@Controller("avos/enterprise-metadata")
export class EnterpriseMetadataController {
  constructor(private readonly registry: MetadataRegistryService, private readonly graph: DependencyGraphService, private readonly governance: MetadataGovernanceService, private readonly health: MetadataHealthService, private readonly certification: MetadataCertificationService) {}
  @Get("health") getHealth() { return this.health.report(); }
  @Get("assets") listAssets() { return this.registry.list(); }
  @Get("assets/:id") getAsset(@Param("id") id: string) { return this.registry.get(id); }
  @Post("assets") register(@Body() body: RegisterMetadataDto) { return this.registry.register(body); }
  @Patch("assets/:id") update(@Param("id") id: string, @Body() body: UpdateMetadataDto) { return this.registry.update(id, body); }
  @Post("dependencies") link(@Body() body: LinkDependencyDto) { return this.graph.link(body); }
  @Get("dependencies") dependencies() { return this.graph.list(); }
  @Get("graph") getGraph() { return this.graph.graph(); }
  @Get("lineage/:id") lineage(@Param("id") id: string) { return this.graph.lineage(id); }
  @Get("impact/:id") impact(@Param("id") id: string) { return this.graph.impact(id); }
  @Get("governance/:id") governanceStatus(@Param("id") id: string) { return this.governance.evaluate(this.registry.get(id)); }
  @Post("final-review/run") review() { return this.certification.runReview(); }
  @Post("certification/certify") certify() { return this.certification.certify(); }
  @Get("certification/status") certificationStatus() { return this.certification.status(); }
}
