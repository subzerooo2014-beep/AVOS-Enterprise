import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { KnowledgeEvolutionEngineService } from "./knowledge-evolution-engine.service";
import { KnowledgeEvolutionHealthService } from "./knowledge-evolution-health.service";
import { KnowledgeCompatibilityService } from "./knowledge-compatibility.service";
import { KnowledgeMergeService } from "./knowledge-merge.service";
import { KnowledgeRetirementService } from "./knowledge-retirement.service";
import { KnowledgeEvolutionCandidate } from "./knowledge-evolution.types";

@Controller("knowledge-fabric/evolution")
export class KnowledgeEvolutionController {
  constructor(private readonly engine: KnowledgeEvolutionEngineService, private readonly health: KnowledgeEvolutionHealthService, private readonly compatibility: KnowledgeCompatibilityService, private readonly mergeService: KnowledgeMergeService, private readonly retirement: KnowledgeRetirementService) {}
  @Get("status") status() { return this.health.status(); }
  @Get("metrics") metrics() { return this.engine.metrics(); }
  @Get("candidate/:id") candidate(@Param("id") id: string) { return this.engine.get(id); }
  @Post("propose") propose(@Body() body: Omit<KnowledgeEvolutionCandidate, "id" | "createdAt">) { return this.engine.propose(body); }
  @Post("assess/:id") assess(@Param("id") id: string) { return this.engine.assess(id); }
  @Post("plan/:id") plan(@Param("id") id: string) { return this.engine.plan(id); }
  @Post("apply/:id") apply(@Param("id") id: string, @Body() body: { actorId: string }) { return this.engine.apply(id, body.actorId); }
  @Post("rollback/:id") rollback(@Param("id") id: string, @Body() body: { actorId: string }) { return this.engine.rollback(id, body.actorId); }
  @Post("compatibility") compatibilityCheck(@Body() body: { sourceVersion: number; targetVersion: number; dependencyVersions?: number[] }) { return this.compatibility.evaluate(body); }
  @Post("merge") merge(@Body() body: { base: Record<string, unknown>; incoming: Record<string, unknown>; strategy?: "PREFER_BASE" | "PREFER_INCOMING" }) { return this.mergeService.merge(body.base, body.incoming, body.strategy); }
  @Post("retire") retire(@Body() body: { knowledgeId: string; reason: string; replacements?: string[]; approved: boolean; actorId: string }) { return this.retirement.retire(body); }
}