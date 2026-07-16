import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AutonomousOperationsService } from "./autonomous-operations.service";
import { DecisionIntelligenceService } from "./decision-intelligence.service";
import { EnterpriseDigitalTwinService } from "./enterprise-digital-twin.service";
import { EnterpriseKnowledgeGraphService } from "./enterprise-knowledge-graph.service";
import { IntelligenceCommandCenterService } from "./intelligence-command-center.service";
import type {
  DecisionRecord,
  DigitalTwinRecord,
  KnowledgeEntityRecord,
} from "./enterprise-intelligence-command.types";

@Controller("enterprise-intelligence-command-platform")
export class EnterpriseIntelligenceCommandPlatformController {
  constructor(
    private readonly commandCenter: IntelligenceCommandCenterService,
    private readonly decisions: DecisionIntelligenceService,
    private readonly knowledge: EnterpriseKnowledgeGraphService,
    private readonly twins: EnterpriseDigitalTwinService,
    private readonly operations: AutonomousOperationsService,
  ) {}

  @Get("status")
  status() {
    return this.commandCenter.health();
  }

  @Get("dashboard")
  dashboard() {
    return this.commandCenter.dashboard();
  }

  @Post("decisions")
  createDecision(
    @Body() body: Omit<DecisionRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, decision: this.decisions.create(body) };
  }

  @Post("decisions/:id/scenarios")
  addScenario(
    @Param("id") id: string,
    @Body()
    body: {
      name: string;
      assumptions: Record<string, unknown>;
      score: number;
      impact: number;
      risk: number;
    },
  ) {
    return {
      success: true,
      scenario: this.decisions.addScenario(
        id,
        body.name,
        body.assumptions,
        body.score,
        body.impact,
        body.risk,
      ),
    };
  }

  @Post("decisions/:id/recommend")
  recommend(@Param("id") id: string) {
    return { success: true, recommendations: this.decisions.recommend(id) };
  }

  @Post("decisions/:id/approve")
  approveDecision(
    @Param("id") id: string,
    @Body()
    body: {
      selectedOption: string;
      confidence: number;
      rationale: string;
    },
  ) {
    return {
      success: true,
      decision: this.decisions.approve(
        id,
        body.selectedOption,
        body.confidence,
        body.rationale,
      ),
    };
  }

  @Post("knowledge/entities")
  upsertKnowledgeEntity(
    @Body()
    body: Omit<KnowledgeEntityRecord, "version" | "createdAt" | "updatedAt">,
  ) {
    return { success: true, entity: this.knowledge.upsertEntity(body) };
  }

  @Post("knowledge/relations")
  connectKnowledge(
    @Body()
    body: {
      sourceId: string;
      targetId: string;
      relation: string;
      weight?: number;
    },
  ) {
    return {
      success: true,
      relation: this.knowledge.connect(
        body.sourceId,
        body.targetId,
        body.relation,
        body.weight,
      ),
    };
  }

  @Post("digital-twins")
  upsertTwin(
    @Body()
    body: Omit<DigitalTwinRecord, "version" | "createdAt" | "updatedAt">,
  ) {
    return { success: true, twin: this.twins.upsertTwin(body) };
  }

  @Post("digital-twins/:id/simulate")
  simulateTwin(
    @Param("id") id: string,
    @Body() body: { scenario: string; inputs: Record<string, unknown> },
  ) {
    return {
      success: true,
      simulation: this.twins.simulate(id, body.scenario, body.inputs),
    };
  }

  @Post("operations")
  planOperation(
    @Body()
    body: {
      name: string;
      type: string;
      priority: number;
      steps: string[];
      context?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      operation: this.operations.plan(
        body.name,
        body.type,
        body.priority,
        body.steps,
        body.context,
      ),
    };
  }

  @Post("operations/:id/start")
  startOperation(@Param("id") id: string) {
    return { success: true, operation: this.operations.start(id) };
  }

  @Post("operations/:id/advance")
  advanceOperation(@Param("id") id: string) {
    return { success: true, operation: this.operations.advance(id) };
  }

  @Post("alerts")
  raiseAlert(
    @Body()
    body: {
      source: string;
      severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
      title: string;
      message: string;
    },
  ) {
    return {
      success: true,
      alert: this.commandCenter.raiseAlert(
        body.source,
        body.severity,
        body.title,
        body.message,
      ),
    };
  }

  @Post("alerts/:id/resolve")
  resolveAlert(@Param("id") id: string) {
    return {
      success: true,
      alert: this.commandCenter.resolveAlert(id),
    };
  }
}
