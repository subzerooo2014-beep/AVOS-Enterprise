import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { IdentityKind } from "./contracts/digital-identity.contracts";
import { EvaluateIdentityPolicyDto, LinkIdentityDto, MergeIdentityDto, RegisterIdentityDto, UpdateIdentityDto, VerifyIdentityDto } from "./dto/digital-identity.dto";
import { IdentityAuditService } from "./services/identity-audit.service";
import { IdentityCertificationService } from "./services/identity-certification.service";
import { IdentityGovernanceService } from "./services/identity-governance.service";
import { IdentityGraphService } from "./services/identity-graph.service";
import { IdentityHealthService } from "./services/identity-health.service";
import { IdentityIntelligenceService } from "./services/identity-intelligence.service";
import { IdentityRegistryService } from "./services/identity-registry.service";

@Controller("avos/digital-identity")
export class DigitalIdentityController {
  constructor(
    private readonly registry: IdentityRegistryService,
    private readonly graph: IdentityGraphService,
    private readonly governance: IdentityGovernanceService,
    private readonly intelligence: IdentityIntelligenceService,
    private readonly health: IdentityHealthService,
    private readonly audit: IdentityAuditService,
    private readonly certification: IdentityCertificationService,
  ) {}

  @Post("identities") register(@Body() dto: RegisterIdentityDto) { return this.registry.register(dto); }
  @Get("identities") search(@Query("q") query = "", @Query("kind") kind?: IdentityKind) { return this.registry.search(query, kind); }
  @Get("identities/resolve/:reference") resolve(@Param("reference") reference: string) { return this.registry.resolve(reference); }
  @Get("identities/:id") get(@Param("id") id: string) { return this.registry.get(id); }
  @Patch("identities/:id") update(@Param("id") id: string, @Body() dto: UpdateIdentityDto) { return this.registry.update(id, dto); }
  @Post("relationships") link(@Body() dto: LinkIdentityDto) { return this.graph.link(dto); }
  @Get("relationships") relationships(@Query("identityId") identityId?: string) { return this.graph.list(identityId); }
  @Post("verify") verify(@Body() dto: VerifyIdentityDto) { return this.governance.verify(dto); }
  @Post("merge") merge(@Body() dto: MergeIdentityDto) { return this.governance.merge(dto); }
  @Post("governance/evaluate") evaluate(@Body() dto: EvaluateIdentityPolicyDto) { return this.governance.evaluate(dto); }
  @Get("governance/evaluations") evaluations() { return this.governance.listEvaluations(); }
  @Get("intelligence/duplicates") duplicates() { return this.intelligence.duplicateCandidates(); }
  @Get("analytics") analytics() { return this.intelligence.analytics(); }
  @Get("audit") audits(@Query("limit") limit?: string) { return this.audit.list(limit ? Number(limit) : 100); }
  @Get("health") healthReport() { return this.health.report(); }
  @Post("final-review/run") finalReview() { return this.certification.runFinalReview(); }
  @Post("certification/certify") certify() { return this.certification.certify(); }
  @Get("certification/status") certificationStatus() { return this.certification.status(); }
}
