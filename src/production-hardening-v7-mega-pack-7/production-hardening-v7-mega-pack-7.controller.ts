import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CompleteChaosDrillDto,
  CreateChaosDrillDto,
  CreateContinuityPlanDto,
  CreateResilienceIncidentDto,
  CreateSloDto,
  EvaluateReleaseDto,
  RecordSloSignalDto,
  ResolveResilienceIncidentDto,
  TestContinuityPlanDto,
} from "./production-hardening-v7-mega-pack-7.dto";
import { ProductionHardeningV7MegaPack7Service } from "./production-hardening-v7-mega-pack-7.service";

@Controller(
  "production-hardening-v7/mega-pack-7",
)
export class ProductionHardeningV7MegaPack7Controller {
  constructor(
    private readonly service: ProductionHardeningV7MegaPack7Service,
  ) {}

  @Get("status")
  getStatus() {
    return this.service.getStatus();
  }

  @Get("snapshot")
  getSnapshot() {
    return this.service.getSnapshot();
  }

  @Get("evidence/verify")
  verifyEvidenceChain() {
    return this.service.verifyEvidenceChain();
  }

  @Get("slos")
  listSlos() {
    return this.service.listSlos();
  }

  @Post("slos")
  createSlo(
    @Body() dto: CreateSloDto,
  ) {
    return this.service.createSlo(dto);
  }

  @Post("slos/:sloId/signals")
  recordSignal(
    @Param("sloId") sloId: string,
    @Body() dto: RecordSloSignalDto,
  ) {
    return this.service.recordSignal(
      sloId,
      dto,
    );
  }

  @Get("incidents")
  listIncidents() {
    return this.service.listIncidents();
  }

  @Post("incidents")
  createIncident(
    @Body()
    dto: CreateResilienceIncidentDto,
  ) {
    return this.service.createIncident(dto);
  }

  @Post("incidents/:incidentId/resolve")
  resolveIncident(
    @Param("incidentId")
    incidentId: string,
    @Body()
    dto: ResolveResilienceIncidentDto,
  ) {
    return this.service.resolveIncident(
      incidentId,
      dto,
    );
  }

  @Post("release-gates/evaluate")
  evaluateRelease(
    @Body() dto: EvaluateReleaseDto,
  ) {
    return this.service.evaluateRelease(dto);
  }

  @Get("continuity-plans")
  listContinuityPlans() {
    return this.service.listContinuityPlans();
  }

  @Post("continuity-plans")
  createContinuityPlan(
    @Body()
    dto: CreateContinuityPlanDto,
  ) {
    return this.service.createContinuityPlan(
      dto,
    );
  }

  @Post("continuity-plans/:planId/test")
  testContinuityPlan(
    @Param("planId") planId: string,
    @Body() dto: TestContinuityPlanDto,
  ) {
    return this.service.testContinuityPlan(
      planId,
      dto,
    );
  }

  @Get("chaos-drills")
  listChaosDrills() {
    return this.service.listChaosDrills();
  }

  @Post("chaos-drills")
  createChaosDrill(
    @Body() dto: CreateChaosDrillDto,
  ) {
    return this.service.createChaosDrill(
      dto,
    );
  }

  @Post("chaos-drills/:drillId/start")
  startChaosDrill(
    @Param("drillId") drillId: string,
  ) {
    return this.service.startChaosDrill(
      drillId,
    );
  }

  @Post("chaos-drills/:drillId/complete")
  completeChaosDrill(
    @Param("drillId") drillId: string,
    @Body() dto: CompleteChaosDrillDto,
  ) {
    return this.service.completeChaosDrill(
      drillId,
      dto,
    );
  }
}
