import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeEvolutionAssessorService } from "./knowledge-evolution-assessor.service";
import { KnowledgeEvolutionPlannerService } from "./knowledge-evolution-planner.service";
import { KnowledgeVersionStoreService } from "./knowledge-version-store.service";
import { KnowledgeEvolutionCandidate, KnowledgeEvolutionPlan, KnowledgeEvolutionResult } from "./knowledge-evolution.types";

@Injectable()
export class KnowledgeEvolutionEngineService {
  private readonly candidates = new Map<string, KnowledgeEvolutionCandidate>();
  private readonly plans = new Map<string, KnowledgeEvolutionPlan>();

  constructor(
    private readonly assessor: KnowledgeEvolutionAssessorService,
    private readonly planner: KnowledgeEvolutionPlannerService,
    private readonly versions: KnowledgeVersionStoreService,
  ) {}

  propose(input: Omit<KnowledgeEvolutionCandidate, "id" | "createdAt">): KnowledgeEvolutionCandidate {
    if (input.targetVersion <= input.sourceVersion) throw new BadRequestException("targetVersion must be greater than sourceVersion");
    const candidate: KnowledgeEvolutionCandidate = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    this.candidates.set(candidate.id, candidate);
    return candidate;
  }

  get(candidateId: string): KnowledgeEvolutionCandidate {
    const candidate = this.candidates.get(candidateId);
    if (!candidate) throw new NotFoundException(`Evolution candidate ${candidateId} was not found`);
    return candidate;
  }

  assess(candidateId: string) {
    return this.assessor.assess(this.get(candidateId));
  }

  plan(candidateId: string): KnowledgeEvolutionPlan {
    const candidate = this.get(candidateId);
    const plan = this.planner.create(candidate, this.assessor.assess(candidate));
    this.plans.set(candidateId, plan);
    return plan;
  }

  apply(candidateId: string, actorId: string): KnowledgeEvolutionResult {
    const candidate = this.get(candidateId);
    const assessment = this.assessor.assess(candidate);
    if (!assessment.compatible) throw new BadRequestException("Evolution candidate is not compatible");
    const plan = this.plans.get(candidateId) ?? this.plan(candidateId);
    plan.stage = "APPLIED";
    plan.updatedAt = new Date().toISOString();
    const version = this.versions.record({ knowledgeId: candidate.knowledgeId, version: candidate.targetVersion, previousVersion: candidate.sourceVersion, changeType: candidate.changeType, changedBy: actorId, payload: candidate.payload, metadata: { candidateId } });
    return { candidate, assessment, plan, applied: true, version };
  }

  rollback(candidateId: string, actorId: string): KnowledgeEvolutionResult {
    const candidate = this.get(candidateId);
    const assessment = this.assessor.assess(candidate);
    const plan = this.plans.get(candidateId) ?? this.plan(candidateId);
    plan.stage = "ROLLED_BACK";
    plan.updatedAt = new Date().toISOString();
    const version = this.versions.record({ knowledgeId: candidate.knowledgeId, version: candidate.sourceVersion, previousVersion: candidate.targetVersion, changeType: "CORRECT", changedBy: actorId, payload: candidate.payload, metadata: { rollbackOf: candidateId } });
    return { candidate, assessment, plan, applied: false, version };
  }

  metrics() {
    const candidates = [...this.candidates.values()];
    return { candidates: candidates.length, plans: this.plans.size, versions: this.versions.count(), byType: candidates.reduce<Record<string, number>>((acc, item) => { acc[item.changeType] = (acc[item.changeType] ?? 0) + 1; return acc; }, {}) };
  }
}