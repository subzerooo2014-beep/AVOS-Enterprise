import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ArchitectureApprovalDto,
  ProposeArchitectureChangeDto,
  RegisterArchitectureComponentDto,
} from "./dto/architecture-intelligence.dto";
import { ArchitectureAnalysisService } from "./services/architecture-analysis.service";
import { ArchitectureCertificationService } from "./services/architecture-certification.service";
import { ArchitectureHealthService } from "./services/architecture-health.service";
import { ArchitectureRegistryService } from "./services/architecture-registry.service";
import { ArchitectureRulesService } from "./services/architecture-rules.service";
import { ChangeImpactService } from "./services/change-impact.service";

@Controller("avos/architecture-intelligence")
export class ArchitectureIntelligenceController {
  constructor(
    private readonly registry: ArchitectureRegistryService,
    private readonly rules: ArchitectureRulesService,
    private readonly analysis: ArchitectureAnalysisService,
    private readonly health: ArchitectureHealthService,
    private readonly changes: ChangeImpactService,
    private readonly certification: ArchitectureCertificationService,
  ) {}

  @Get("health")
  getHealth() {
    return this.health.getHealth();
  }

  @Get("architecture")
  getArchitecture() {
    return this.registry.list();
  }

  @Post("architecture")
  registerArchitecture(@Body() body: RegisterArchitectureComponentDto) {
    return this.registry.register(body);
  }

  @Get("rules")
  getRules() {
    return this.rules.list();
  }

  @Get("analysis")
  analyze() {
    return this.analysis.analyze();
  }

  @Get("recommendations")
  recommendations() {
    return this.analysis.analyze().recommendations;
  }

  @Get("changes")
  listChanges() {
    return this.changes.list();
  }

  @Post("changes")
  proposeChange(@Body() body: ProposeArchitectureChangeDto) {
    return this.changes.propose(body);
  }

  @Post("changes/:id/approve")
  approveChange(@Param("id") id: string, @Body() body: ArchitectureApprovalDto) {
    return this.changes.approve(id, body);
  }

  @Get("impact/:id")
  impact(@Param("id") id: string) {
    return this.changes.analyze(id);
  }

  @Post("final-review/run")
  finalReview() {
    return this.certification.runFinalReview();
  }

  @Post("certification/certify")
  certify() {
    return this.certification.certify();
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}