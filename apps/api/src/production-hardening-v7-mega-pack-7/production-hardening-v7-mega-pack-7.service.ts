import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
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
import { ProductionHardeningV7MegaPack7Store } from "./production-hardening-v7-mega-pack-7.store";
import {
  ChaosDrill,
  ContinuityPlan,
  ErrorBudgetSnapshot,
  ReleaseCandidate,
  ReleaseGateEvaluation,
  ResilienceHealth,
  ResilienceIncident,
  ResilienceState,
  ResilienceStatusResponse,
  ServiceLevelObjective,
  SloSignal,
} from "./production-hardening-v7-mega-pack-7.types";

@Injectable()
export class ProductionHardeningV7MegaPack7Service
  implements OnModuleInit
{
  constructor(
    private readonly store: ProductionHardeningV7MegaPack7Store,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.store.waitUntilReady();
    await this.bootstrapDefaults();
  }

  getStatus(): ResilienceStatusResponse {
    const state = this.store.getSnapshot();

    const latestBudgets =
      this.getLatestBudgetBySlo(state);

    const budgets = [...latestBudgets.values()];

    const evidenceVerification =
      this.store.verifyEvidenceChain();

    const healthStatus =
      this.calculateHealth(state, budgets);

    return {
      success: true,
      system:
        "AVOS Production Hardening V7 — Mega Pack 7",
      version: "v7-mega-pack-7",
      healthStatus,
      evidenceChainVerified:
        evidenceVerification.verified,

      slos: state.slos.length,
      activeSlos: state.slos.filter(
        (item) => item.active,
      ).length,

      healthySlos: budgets.filter(
        (item) => item.status === "healthy",
      ).length,

      atRiskSlos: budgets.filter(
        (item) => item.status === "at_risk",
      ).length,

      exhaustedSlos: budgets.filter(
        (item) => item.status === "exhausted",
      ).length,

      signals: state.signals.length,

      incidents: state.incidents.length,
      openIncidents: state.incidents.filter(
        (item) => item.status !== "resolved",
      ).length,

      releaseCandidates:
        state.releaseCandidates.length,

      releaseEvaluations:
        state.releaseEvaluations.length,

      approvedReleases:
        state.releaseEvaluations.filter(
          (item) =>
            item.decision === "approved" ||
            item.decision ===
              "conditionally_approved",
        ).length,

      blockedReleases:
        state.releaseEvaluations.filter(
          (item) => item.decision === "blocked",
        ).length,

      continuityPlans:
        state.continuityPlans.length,

      validatedContinuityPlans:
        state.continuityPlans.filter(
          (item) => item.status === "validated",
        ).length,

      chaosDrills: state.chaosDrills.length,

      failedChaosDrills:
        state.chaosDrills.filter(
          (item) => item.status === "failed",
        ).length,

      evidenceEntries: state.evidence.length,
      platformEvents: state.events.length,

      updatedAt: state.updatedAt,
    };
  }

  getSnapshot(): ResilienceState & {
    evidenceVerification: {
      verified: boolean;
      checked: number;
      brokenAt: string | null;
    };
  } {
    return {
      ...this.store.getSnapshot(),
      evidenceVerification:
        this.store.verifyEvidenceChain(),
    };
  }

  listSlos(): Array<
    ServiceLevelObjective & {
      latestBudget: ErrorBudgetSnapshot | null;
    }
  > {
    const state = this.store.getSnapshot();
    const budgets = this.getLatestBudgetBySlo(state);

    return state.slos.map((slo) => ({
      ...slo,
      latestBudget: budgets.get(slo.id) ?? null,
    }));
  }

  async createSlo(
    dto: CreateSloDto,
  ): Promise<ServiceLevelObjective> {
    const normalizedCode = dto.code
      .trim()
      .toUpperCase();

    const state = this.store.getSnapshot();

    if (
      state.slos.some(
        (item) =>
          item.code.toUpperCase() === normalizedCode,
      )
    ) {
      throw new ConflictException(
        `SLO code already exists: ${normalizedCode}`,
      );
    }

    if (
      dto.warningThresholdPercentage !== undefined &&
      dto.criticalThresholdPercentage !== undefined &&
      dto.warningThresholdPercentage >=
        dto.criticalThresholdPercentage
    ) {
      throw new BadRequestException(
        "warningThresholdPercentage must be lower than criticalThresholdPercentage",
      );
    }

    const now = new Date().toISOString();

    const slo: ServiceLevelObjective = {
      id: randomUUID(),
      code: normalizedCode,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      service: dto.service.trim(),
      indicator: dto.indicator.trim(),
      targetPercentage:
        this.round(dto.targetPercentage, 5),
      windowDays: dto.windowDays,
      warningThresholdPercentage:
        dto.warningThresholdPercentage ?? 60,
      criticalThresholdPercentage:
        dto.criticalThresholdPercentage ?? 100,
      active: true,
      owner: dto.owner?.trim() || null,
      tags: this.uniqueStrings(dto.tags ?? []),
      createdAt: now,
      updatedAt: now,
    };

    await this.store.mutate((mutableState) => {
      mutableState.slos.push(slo);
    });

    await this.recalculateBudget(slo.id);

    await this.recordDomainActivity({
      eventType: "resilience.slo.created",
      entityType: "service_level_objective",
      entityId: slo.id,
      severity: "info",
      message: `SLO ${slo.code} created`,
      payload: slo,
    });

    return slo;
  }

  async recordSignal(
    sloId: string,
    dto: RecordSloSignalDto,
  ): Promise<{
    signal: SloSignal;
    errorBudget: ErrorBudgetSnapshot;
  }> {
    const state = this.store.getSnapshot();

    const slo = state.slos.find(
      (item) => item.id === sloId,
    );

    if (!slo) {
      throw new NotFoundException(
        `SLO not found: ${sloId}`,
      );
    }

    if (
      dto.successfulEvents > dto.totalEvents
    ) {
      throw new BadRequestException(
        "successfulEvents cannot exceed totalEvents",
      );
    }

    const now = new Date().toISOString();

    const availabilityPercentage =
      dto.totalEvents > 0
        ? (dto.successfulEvents /
            dto.totalEvents) *
          100
        : 100;

    const signal: SloSignal = {
      id: randomUUID(),
      sloId,
      successfulEvents: dto.successfulEvents,
      totalEvents: dto.totalEvents,
      availabilityPercentage: this.round(
        availabilityPercentage,
        5,
      ),
      latencyP95Ms:
        dto.latencyP95Ms !== undefined
          ? this.round(dto.latencyP95Ms, 3)
          : null,
      errorCount:
        dto.errorCount ??
        Math.max(
          0,
          dto.totalEvents - dto.successfulEvents,
        ),
      impactMinutes:
        dto.impactMinutes !== undefined
          ? this.round(dto.impactMinutes, 3)
          : 0,
      source: dto.source.trim(),
      metadata: dto.metadata ?? {},
      observedAt: dto.observedAt ?? now,
      createdAt: now,
    };

    await this.store.mutate((mutableState) => {
      mutableState.signals.push(signal);

      if (mutableState.signals.length > 50000) {
        mutableState.signals =
          mutableState.signals.slice(-50000);
      }
    });

    const errorBudget =
      await this.recalculateBudget(sloId);

    await this.recordDomainActivity({
      eventType: "resilience.slo.signal_recorded",
      entityType: "slo_signal",
      entityId: signal.id,
      severity:
        errorBudget.status === "exhausted"
          ? "critical"
          : errorBudget.status === "at_risk"
            ? "warning"
            : "info",
      message:
        `Signal recorded for ${slo.code}; budget status=${errorBudget.status}`,
      payload: {
        signal,
        errorBudget,
      },
    });

    return {
      signal,
      errorBudget,
    };
  }

  listIncidents(): ResilienceIncident[] {
    return this.store
      .getSnapshot()
      .incidents
      .sort((left, right) =>
        right.createdAt.localeCompare(
          left.createdAt,
        ),
      );
  }

  async createIncident(
    dto: CreateResilienceIncidentDto,
  ): Promise<ResilienceIncident> {
    const now = new Date().toISOString();

    const incident: ResilienceIncident = {
      id: randomUUID(),
      title: dto.title.trim(),
      service: dto.service.trim(),
      severity: dto.severity,
      status: "open",
      impactMinutes: this.round(
        dto.impactMinutes ?? 0,
        3,
      ),
      customerImpact:
        dto.customerImpact?.trim() || null,
      rootCause: null,
      remediation: null,
      startedAt: dto.startedAt ?? now,
      resolvedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    await this.store.mutate((state) => {
      state.incidents.push(incident);
    });

    await this.recordDomainActivity({
      eventType:
        "resilience.incident.created",
      entityType: "resilience_incident",
      entityId: incident.id,
      severity:
        incident.severity === "critical"
          ? "critical"
          : incident.severity === "high"
            ? "warning"
            : "info",
      message: `Resilience incident opened: ${incident.title}`,
      payload: incident,
    });

    return incident;
  }

  async resolveIncident(
    incidentId: string,
    dto: ResolveResilienceIncidentDto,
  ): Promise<ResilienceIncident> {
    const state = this.store.getSnapshot();

    const existing = state.incidents.find(
      (item) => item.id === incidentId,
    );

    if (!existing) {
      throw new NotFoundException(
        `Incident not found: ${incidentId}`,
      );
    }

    if (existing.status === "resolved") {
      throw new ConflictException(
        "Incident is already resolved",
      );
    }

    const now = new Date().toISOString();

    const updated: ResilienceIncident = {
      ...existing,
      status: "resolved",
      rootCause: dto.rootCause.trim(),
      remediation: dto.remediation.trim(),
      impactMinutes:
        dto.impactMinutes !== undefined
          ? this.round(dto.impactMinutes, 3)
          : existing.impactMinutes,
      resolvedAt: now,
      updatedAt: now,
    };

    await this.store.mutate((mutableState) => {
      const index =
        mutableState.incidents.findIndex(
          (item) => item.id === incidentId,
        );

      mutableState.incidents[index] = updated;
    });

    await this.recordDomainActivity({
      eventType:
        "resilience.incident.resolved",
      entityType: "resilience_incident",
      entityId: updated.id,
      severity: "info",
      message: `Resilience incident resolved: ${updated.title}`,
      payload: updated,
    });

    return updated;
  }

  async evaluateRelease(
    dto: EvaluateReleaseDto,
  ): Promise<{
    candidate: ReleaseCandidate;
    evaluation: ReleaseGateEvaluation;
  }> {
    const now = new Date().toISOString();

    const candidate: ReleaseCandidate = {
      id: randomUUID(),
      version: dto.version.trim(),
      environment: dto.environment.trim(),
      service: dto.service.trim(),
      requestedBy:
        dto.requestedBy?.trim() || null,
      changeRiskScore: this.round(
        dto.changeRiskScore,
        2,
      ),
      rollbackReady: dto.rollbackReady,
      monitoringReady: dto.monitoringReady,
      testCoveragePercentage: this.round(
        dto.testCoveragePercentage,
        2,
      ),
      securityVerified:
        dto.securityVerified,
      evidenceVerified:
        dto.evidenceVerified,
      metadata: dto.metadata ?? {},
      createdAt: now,
    };

    const state = this.store.getSnapshot();

    const blockers: string[] = [];
    const warnings: string[] = [];
    const passedChecks: string[] = [];

    let score = 100;

    const serviceSlos = state.slos.filter(
      (item) =>
        item.active &&
        item.service.toLowerCase() ===
          candidate.service.toLowerCase(),
    );

    const latestBudgets =
      this.getLatestBudgetBySlo(state);

    const serviceBudgets = serviceSlos
      .map((slo) => latestBudgets.get(slo.id))
      .filter(
        (
          item,
        ): item is ErrorBudgetSnapshot =>
          Boolean(item),
      );

    if (
      serviceBudgets.some(
        (item) => item.status === "exhausted",
      )
    ) {
      blockers.push(
        "One or more service error budgets are exhausted",
      );
      score -= 40;
    } else if (
      serviceBudgets.some(
        (item) => item.status === "at_risk",
      )
    ) {
      warnings.push(
        "One or more service error budgets are at risk",
      );
      score -= 15;
    } else {
      passedChecks.push(
        "Service error budgets are healthy",
      );
    }

    const criticalIncidents =
      state.incidents.filter(
        (item) =>
          item.status !== "resolved" &&
          item.service.toLowerCase() ===
            candidate.service.toLowerCase() &&
          (item.severity === "critical" ||
            item.severity === "high"),
      );

    if (criticalIncidents.length > 0) {
      blockers.push(
        "Open high or critical incidents exist for the service",
      );
      score -= 35;
    } else {
      passedChecks.push(
        "No open high or critical incidents",
      );
    }

    if (!candidate.rollbackReady) {
      blockers.push(
        "Rollback procedure is not ready",
      );
      score -= 25;
    } else {
      passedChecks.push(
        "Rollback procedure verified",
      );
    }

    if (!candidate.monitoringReady) {
      blockers.push(
        "Production monitoring is not ready",
      );
      score -= 20;
    } else {
      passedChecks.push(
        "Production monitoring verified",
      );
    }

    if (!candidate.securityVerified) {
      blockers.push(
        "Security verification is missing",
      );
      score -= 30;
    } else {
      passedChecks.push(
        "Security verification passed",
      );
    }

    if (!candidate.evidenceVerified) {
      blockers.push(
        "Release evidence is not verified",
      );
      score -= 20;
    } else {
      passedChecks.push(
        "Release evidence verified",
      );
    }

    if (
      candidate.testCoveragePercentage < 70
    ) {
      blockers.push(
        "Test coverage is below 70%",
      );
      score -= 25;
    } else if (
      candidate.testCoveragePercentage < 85
    ) {
      warnings.push(
        "Test coverage is below the recommended 85%",
      );
      score -= 10;
    } else {
      passedChecks.push(
        "Test coverage meets release standard",
      );
    }

    if (candidate.changeRiskScore >= 80) {
      blockers.push(
        "Change risk score is critically high",
      );
      score -= 30;
    } else if (
      candidate.changeRiskScore >= 60
    ) {
      warnings.push(
        "Change risk score requires enhanced approval",
      );
      score -= 15;
    } else {
      passedChecks.push(
        "Change risk score is acceptable",
      );
    }

    const failedDrills =
      state.chaosDrills.filter(
        (item) =>
          item.service.toLowerCase() ===
            candidate.service.toLowerCase() &&
          item.status === "failed" &&
          item.remediationActions.length === 0,
      );

    if (failedDrills.length > 0) {
      warnings.push(
        "Unremediated failed resilience drills exist",
      );
      score -= 15;
    } else {
      passedChecks.push(
        "No unremediated failed resilience drills",
      );
    }

    score = Math.max(
      0,
      Math.min(100, score),
    );

    const decision =
      blockers.length > 0
        ? "blocked"
        : warnings.length > 0
          ? "conditionally_approved"
          : "approved";

    const evaluation: ReleaseGateEvaluation = {
      id: randomUUID(),
      releaseCandidateId: candidate.id,
      decision,
      score,
      blockers,
      warnings,
      passedChecks,
      evaluatedAt: now,
    };

    await this.store.mutate((mutableState) => {
      mutableState.releaseCandidates.push(
        candidate,
      );

      mutableState.releaseEvaluations.push(
        evaluation,
      );
    });

    await this.recordDomainActivity({
      eventType:
        "resilience.release_gate.evaluated",
      entityType: "release_candidate",
      entityId: candidate.id,
      severity:
        decision === "blocked"
          ? "critical"
          : decision ===
                "conditionally_approved"
            ? "warning"
            : "info",
      message:
        `Release ${candidate.version} evaluated: ${decision}`,
      payload: {
        candidate,
        evaluation,
      },
    });

    return {
      candidate,
      evaluation,
    };
  }

  listContinuityPlans(): ContinuityPlan[] {
    return this.store
      .getSnapshot()
      .continuityPlans
      .sort((left, right) =>
        right.updatedAt.localeCompare(
          left.updatedAt,
        ),
      );
  }

  async createContinuityPlan(
    dto: CreateContinuityPlanDto,
  ): Promise<ContinuityPlan> {
    const normalizedCode = dto.code
      .trim()
      .toUpperCase();

    const state = this.store.getSnapshot();

    if (
      state.continuityPlans.some(
        (item) =>
          item.code.toUpperCase() ===
          normalizedCode,
      )
    ) {
      throw new ConflictException(
        `Continuity plan code already exists: ${normalizedCode}`,
      );
    }

    if (
      dto.maximumTolerableDowntimeMinutes <
      dto.recoveryTimeObjectiveMinutes
    ) {
      throw new BadRequestException(
        "Maximum tolerable downtime cannot be lower than the recovery time objective",
      );
    }

    const now = new Date().toISOString();

    const plan: ContinuityPlan = {
      id: randomUUID(),
      code: normalizedCode,
      name: dto.name.trim(),
      service: dto.service.trim(),
      owner: dto.owner?.trim() || null,
      status: "active",
      recoveryTimeObjectiveMinutes:
        dto.recoveryTimeObjectiveMinutes,
      recoveryPointObjectiveMinutes:
        dto.recoveryPointObjectiveMinutes,
      maximumTolerableDowntimeMinutes:
        dto.maximumTolerableDowntimeMinutes,
      dependencies: this.uniqueStrings(
        dto.dependencies ?? [],
      ),
      recoverySteps: this.uniqueStrings(
        dto.recoverySteps,
      ),
      communicationSteps:
        this.uniqueStrings(
          dto.communicationSteps ?? [],
        ),
      lastTestedAt: null,
      nextTestDueAt:
        dto.nextTestDueAt ?? null,
      lastObservedRecoveryMinutes: null,
      evidenceVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    await this.store.mutate((mutableState) => {
      mutableState.continuityPlans.push(plan);
    });

    await this.recordDomainActivity({
      eventType:
        "resilience.continuity_plan.created",
      entityType: "continuity_plan",
      entityId: plan.id,
      severity: "info",
      message:
        `Continuity plan ${plan.code} created`,
      payload: plan,
    });

    return plan;
  }

  async testContinuityPlan(
    planId: string,
    dto: TestContinuityPlanDto,
  ): Promise<ContinuityPlan> {
    const state = this.store.getSnapshot();

    const existing =
      state.continuityPlans.find(
        (item) => item.id === planId,
      );

    if (!existing) {
      throw new NotFoundException(
        `Continuity plan not found: ${planId}`,
      );
    }

    const now = new Date().toISOString();

    const withinRto =
      dto.observedRecoveryMinutes <=
      existing.recoveryTimeObjectiveMinutes;

    const updated: ContinuityPlan = {
      ...existing,
      status:
        withinRto && dto.evidenceVerified
          ? "validated"
          : "failed",
      lastTestedAt: now,
      lastObservedRecoveryMinutes:
        this.round(
          dto.observedRecoveryMinutes,
          3,
        ),
      evidenceVerified:
        dto.evidenceVerified,
      updatedAt: now,
    };

    await this.store.mutate((mutableState) => {
      const index =
        mutableState.continuityPlans.findIndex(
          (item) => item.id === planId,
        );

      mutableState.continuityPlans[index] =
        updated;
    });

    await this.recordDomainActivity({
      eventType:
        "resilience.continuity_plan.tested",
      entityType: "continuity_plan",
      entityId: updated.id,
      severity:
        updated.status === "validated"
          ? "info"
          : "critical",
      message:
        `Continuity plan ${updated.code} tested: ${updated.status}`,
      payload: {
        plan: updated,
        findings: dto.findings ?? [],
        withinRto,
      },
    });

    return updated;
  }

  listChaosDrills(): ChaosDrill[] {
    return this.store
      .getSnapshot()
      .chaosDrills
      .sort((left, right) =>
        right.createdAt.localeCompare(
          left.createdAt,
        ),
      );
  }

  async createChaosDrill(
    dto: CreateChaosDrillDto,
  ): Promise<ChaosDrill> {
    const now = new Date().toISOString();

    const drill: ChaosDrill = {
      id: randomUUID(),
      name: dto.name.trim(),
      service: dto.service.trim(),
      scenario: dto.scenario.trim(),
      expectedOutcome:
        dto.expectedOutcome.trim(),
      status: "planned",
      plannedAt: dto.plannedAt ?? now,
      startedAt: null,
      completedAt: null,
      observedRecoveryMinutes: null,
      withinRto: null,
      findings: [],
      remediationActions: [],
      evidenceVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    await this.store.mutate((state) => {
      state.chaosDrills.push(drill);
    });

    await this.recordDomainActivity({
      eventType:
        "resilience.chaos_drill.planned",
      entityType: "chaos_drill",
      entityId: drill.id,
      severity: "info",
      message:
        `Chaos drill planned: ${drill.name}`,
      payload: drill,
    });

    return drill;
  }

  async startChaosDrill(
    drillId: string,
  ): Promise<ChaosDrill> {
    const state = this.store.getSnapshot();

    const existing =
      state.chaosDrills.find(
        (item) => item.id === drillId,
      );

    if (!existing) {
      throw new NotFoundException(
        `Chaos drill not found: ${drillId}`,
      );
    }

    if (existing.status !== "planned") {
      throw new ConflictException(
        `Chaos drill cannot start from status ${existing.status}`,
      );
    }

    const now = new Date().toISOString();

    const updated: ChaosDrill = {
      ...existing,
      status: "running",
      startedAt: now,
      updatedAt: now,
    };

    await this.store.mutate((mutableState) => {
      const index =
        mutableState.chaosDrills.findIndex(
          (item) => item.id === drillId,
        );

      mutableState.chaosDrills[index] =
        updated;
    });

    await this.recordDomainActivity({
      eventType:
        "resilience.chaos_drill.started",
      entityType: "chaos_drill",
      entityId: updated.id,
      severity: "warning",
      message:
        `Chaos drill started: ${updated.name}`,
      payload: updated,
    });

    return updated;
  }

  async completeChaosDrill(
    drillId: string,
    dto: CompleteChaosDrillDto,
  ): Promise<ChaosDrill> {
    const state = this.store.getSnapshot();

    const existing =
      state.chaosDrills.find(
        (item) => item.id === drillId,
      );

    if (!existing) {
      throw new NotFoundException(
        `Chaos drill not found: ${drillId}`,
      );
    }

    if (
      existing.status !== "running" &&
      existing.status !== "planned"
    ) {
      throw new ConflictException(
        `Chaos drill cannot complete from status ${existing.status}`,
      );
    }

    const servicePlans =
      state.continuityPlans.filter(
        (item) =>
          item.service.toLowerCase() ===
            existing.service.toLowerCase() &&
          item.status !== "retired",
      );

    const applicableRto =
      servicePlans.length > 0
        ? Math.min(
            ...servicePlans.map(
              (item) =>
                item.recoveryTimeObjectiveMinutes,
            ),
          )
        : null;

    const withinRto =
      applicableRto === null
        ? null
        : dto.observedRecoveryMinutes <=
          applicableRto;

    const now = new Date().toISOString();

    const updated: ChaosDrill = {
      ...existing,
      status: dto.status,
      startedAt:
        existing.startedAt ?? now,
      completedAt: now,
      observedRecoveryMinutes:
        this.round(
          dto.observedRecoveryMinutes,
          3,
        ),
      withinRto,
      findings: this.uniqueStrings(
        dto.findings ?? [],
      ),
      remediationActions:
        this.uniqueStrings(
          dto.remediationActions ?? [],
        ),
      evidenceVerified:
        dto.evidenceVerified,
      updatedAt: now,
    };

    await this.store.mutate((mutableState) => {
      const index =
        mutableState.chaosDrills.findIndex(
          (item) => item.id === drillId,
        );

      mutableState.chaosDrills[index] =
        updated;
    });

    await this.recordDomainActivity({
      eventType:
        "resilience.chaos_drill.completed",
      entityType: "chaos_drill",
      entityId: updated.id,
      severity:
        updated.status === "passed" &&
        updated.evidenceVerified
          ? "info"
          : "critical",
      message:
        `Chaos drill completed: ${updated.name} — ${updated.status}`,
      payload: updated,
    });

    return updated;
  }

  verifyEvidenceChain(): {
    success: true;
    verified: boolean;
    checked: number;
    brokenAt: string | null;
  } {
    return {
      success: true,
      ...this.store.verifyEvidenceChain(),
    };
  }

  private async recalculateBudget(
    sloId: string,
  ): Promise<ErrorBudgetSnapshot> {
    const state = this.store.getSnapshot();

    const slo = state.slos.find(
      (item) => item.id === sloId,
    );

    if (!slo) {
      throw new NotFoundException(
        `SLO not found: ${sloId}`,
      );
    }

    const windowStart =
      Date.now() -
      slo.windowDays * 24 * 60 * 60 * 1000;

    const signals = state.signals.filter(
      (item) =>
        item.sloId === sloId &&
        new Date(item.observedAt).getTime() >=
          windowStart,
    );

    const totalEvents = signals.reduce(
      (sum, item) => sum + item.totalEvents,
      0,
    );

    const successfulEvents = signals.reduce(
      (sum, item) =>
        sum + item.successfulEvents,
      0,
    );

    const actualPercentage =
      totalEvents > 0
        ? (successfulEvents / totalEvents) *
          100
        : 100;

    const allowedFailurePercentage =
      Math.max(
        0,
        100 - slo.targetPercentage,
      );

    const consumedFailurePercentage =
      Math.max(
        0,
        100 - actualPercentage,
      );

    const allowedMinutes =
      slo.windowDays *
      24 *
      60 *
      (allowedFailurePercentage / 100);

    const consumedMinutes = signals.reduce(
      (sum, item) =>
        sum + item.impactMinutes,
      0,
    );

    const remainingMinutes =
      allowedMinutes - consumedMinutes;

    const consumptionPercentage =
      allowedMinutes > 0
        ? (consumedMinutes /
            allowedMinutes) *
          100
        : consumedMinutes > 0
          ? 100
          : 0;

    let status: ErrorBudgetSnapshot["status"] =
      "healthy";

    if (
      consumptionPercentage >=
        slo.criticalThresholdPercentage ||
      consumedFailurePercentage >
        allowedFailurePercentage
    ) {
      status = "exhausted";
    } else if (
      consumptionPercentage >=
      slo.warningThresholdPercentage
    ) {
      status = "at_risk";
    }

    const snapshot: ErrorBudgetSnapshot = {
      id: randomUUID(),
      sloId,
      targetPercentage:
        slo.targetPercentage,
      actualPercentage: this.round(
        actualPercentage,
        5,
      ),
      allowedFailurePercentage:
        this.round(
          allowedFailurePercentage,
          5,
        ),
      consumedFailurePercentage:
        this.round(
          consumedFailurePercentage,
          5,
        ),
      allowedMinutes: this.round(
        allowedMinutes,
        3,
      ),
      consumedMinutes: this.round(
        consumedMinutes,
        3,
      ),
      remainingMinutes: this.round(
        remainingMinutes,
        3,
      ),
      consumptionPercentage: this.round(
        consumptionPercentage,
        3,
      ),
      status,
      calculatedAt:
        new Date().toISOString(),
    };

    await this.store.mutate((mutableState) => {
      mutableState.errorBudgets.push(
        snapshot,
      );

      if (
        mutableState.errorBudgets.length >
        20000
      ) {
        mutableState.errorBudgets =
          mutableState.errorBudgets.slice(
            -20000,
          );
      }
    });

    return snapshot;
  }

  private getLatestBudgetBySlo(
    state: ResilienceState,
  ): Map<string, ErrorBudgetSnapshot> {
    const result = new Map<
      string,
      ErrorBudgetSnapshot
    >();

    for (const budget of state.errorBudgets) {
      const current = result.get(
        budget.sloId,
      );

      if (
        !current ||
        budget.calculatedAt >
          current.calculatedAt
      ) {
        result.set(budget.sloId, budget);
      }
    }

    return result;
  }

  private calculateHealth(
    state: ResilienceState,
    budgets: ErrorBudgetSnapshot[],
  ): ResilienceHealth {
    const chain =
      this.store.verifyEvidenceChain();

    if (!chain.verified) {
      return "critical";
    }

    const openCriticalIncident =
      state.incidents.some(
        (item) =>
          item.status !== "resolved" &&
          item.severity === "critical",
      );

    const exhaustedBudget = budgets.some(
      (item) =>
        item.status === "exhausted",
    );

    if (
      openCriticalIncident ||
      exhaustedBudget
    ) {
      return "critical";
    }

    const openHighIncident =
      state.incidents.some(
        (item) =>
          item.status !== "resolved" &&
          item.severity === "high",
      );

    const atRiskBudget = budgets.some(
      (item) => item.status === "at_risk",
    );

    const failedDrill =
      state.chaosDrills.some(
        (item) =>
          item.status === "failed" &&
          item.remediationActions.length === 0,
      );

    if (
      openHighIncident ||
      atRiskBudget ||
      failedDrill
    ) {
      return "degraded";
    }

    return "healthy";
  }

  private async bootstrapDefaults(): Promise<void> {
    const state = this.store.getSnapshot();

    if (state.slos.length === 0) {
      await this.createSlo({
        code: "AVOS-API-AVAILABILITY",
        name: "AVOS API Availability",
        description:
          "Primary production API availability objective",
        service: "avos-api",
        indicator:
          "successful_requests_percentage",
        targetPercentage: 99.9,
        windowDays: 30,
        warningThresholdPercentage: 60,
        criticalThresholdPercentage: 100,
        owner:
          "AVOS Platform Engineering",
        tags: [
          "production",
          "availability",
          "critical",
        ],
      });
    }

    const refreshedState =
      this.store.getSnapshot();

    if (
      refreshedState.continuityPlans.length ===
      0
    ) {
      await this.createContinuityPlan({
        code: "AVOS-API-BCP",
        name:
          "AVOS API Business Continuity Plan",
        service: "avos-api",
        owner:
          "AVOS Platform Engineering",
        recoveryTimeObjectiveMinutes: 30,
        recoveryPointObjectiveMinutes: 5,
        maximumTolerableDowntimeMinutes: 60,
        dependencies: [
          "PostgreSQL",
          "Redis",
          "Object Storage",
          "AI Worker",
        ],
        recoverySteps: [
          "Confirm incident scope and activate incident command",
          "Isolate unhealthy workloads",
          "Restore verified application release",
          "Restore or promote verified database replica",
          "Run integrity and evidence-chain verification",
          "Validate critical API journeys",
          "Resume controlled production traffic",
        ],
        communicationSteps: [
          "Notify incident command",
          "Notify platform owner",
          "Publish operational status update",
          "Record recovery evidence",
        ],
      });
    }

    await this.store.appendEvent({
      eventType:
        "resilience.module.initialized",
      entityType: "system",
      entityId: null,
      severity: "info",
      message:
        "Production Hardening V7 Mega Pack 7 initialized",
      metadata: {
        version: "v7-mega-pack-7",
      },
    });
  }

  private async recordDomainActivity(params: {
    eventType: string;
    entityType: string;
    entityId: string;
    severity:
      | "info"
      | "warning"
      | "critical";
    message: string;
    payload: unknown;
  }): Promise<void> {
    await this.store.appendEvidence({
      evidenceType: params.eventType,
      entityType: params.entityType,
      entityId: params.entityId,
      payload: params.payload,
    });

    await this.store.appendEvent({
      eventType: params.eventType,
      entityType: params.entityType,
      entityId: params.entityId,
      severity: params.severity,
      message: params.message,
      metadata: {
        evidenceRecorded: true,
      },
    });
  }

  private uniqueStrings(
    values: string[],
  ): string[] {
    return [
      ...new Set(
        values
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];
  }

  private round(
    value: number,
    decimals: number,
  ): number {
    const factor = 10 ** decimals;

    return (
      Math.round(
        (value + Number.EPSILON) * factor,
      ) / factor
    );
  }
}

