import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseBrainMegaPack1Service } from "./enterprise-brain-mega-pack-1.service";
import { BrainRuntimeService } from "./runtime/brain-runtime.service";
import { BrainSessionService } from "./sessions/brain-session.service";
import { BrainContextService } from "./context/brain-context.service";
import { BrainIntentService } from "./intent/brain-intent.service";
import { BrainGoalService } from "./goals/brain-goal.service";
import { BrainDecisionService } from "./decisions/brain-decision.service";
import { BrainRegistryService } from "./registry/brain-registry.service";
import { BrainHealthService } from "./health/brain-health.service";
import { BrainAuditService } from "./observability/brain-audit.service";
import {
  BrainContextEntry,
  BrainDecisionOption,
  BrainGoal,
  BrainRegistryEntry
} from "./enterprise-brain-mega-pack-1.types";

@Controller("enterprise-brain-v1")
export class EnterpriseBrainMegaPack1Controller {
  constructor(
    private readonly pack: EnterpriseBrainMegaPack1Service,
    private readonly runtime: BrainRuntimeService,
    private readonly sessions: BrainSessionService,
    private readonly context: BrainContextService,
    private readonly intents: BrainIntentService,
    private readonly goals: BrainGoalService,
    private readonly decisions: BrainDecisionService,
    private readonly registry: BrainRegistryService,
    private readonly health: BrainHealthService,
    private readonly audit: BrainAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("runtime")
  runtimeState() {
    return this.runtime.getState();
  }

  @Post("runtime/start")
  startRuntime(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.runtime.start(body);
  }

  @Post("runtime/stop")
  stopRuntime(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.runtime.stop(body);
  }

  @Post("runtime/safe-mode/enter")
  enterSafeMode(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      reason: string;
      humanApproved: boolean;
    }
  ) {
    return this.runtime.enterSafeMode(body);
  }

  @Post("runtime/safe-mode/exit")
  exitSafeMode(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      humanApproved: boolean;
    }
  ) {
    return this.runtime.exitSafeMode(body);
  }

  @Post("sessions")
  createSession(
    @Body()
    body: {
      ownerIdentityId: string;
      organizationId?: string;
      title: string;
      metadata?: Record<string, unknown>;
      correlationId: string;
    }
  ) {
    return this.sessions.create(body);
  }

  @Get("sessions")
  sessionList() {
    return {
      summary: this.sessions.summary(),
      items: this.sessions.list()
    };
  }

  @Post("sessions/:id/complete")
  completeSession(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.sessions.complete({
      sessionId: id,
      ...body
    });
  }

  @Post("context")
  setContext(
    @Body()
    body: {
      scope: BrainContextEntry["scope"];
      scopeId: string;
      key: string;
      value: unknown;
      source: string;
      confidence?: number;
      sensitive?: boolean;
      expiresAt?: string;
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.context.set(body);
  }

  @Post("context/resolve")
  resolveContext(
    @Body()
    body: {
      scopes: Array<{
        scope: BrainContextEntry["scope"];
        scopeId: string;
      }>;
      includeSensitive: boolean;
    }
  ) {
    return this.context.resolve(body);
  }

  @Get("context")
  contextList() {
    return {
      summary: this.context.summary(),
      items: this.context.list()
    };
  }

  @Post("intents/analyze")
  analyzeIntent(
    @Body()
    body: {
      sessionId: string;
      rawInput: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.intents.analyze(body);
  }

  @Get("intents")
  intentList() {
    return {
      summary: this.intents.summary(),
      items: this.intents.list()
    };
  }

  @Post("goals")
  createGoal(
    @Body()
    body: {
      sessionId: string;
      title: string;
      description: string;
      priority: BrainGoal["priority"];
      parentGoalId?: string;
      dependencies?: string[];
      constraints?: string[];
      successCriteria?: string[];
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.goals.create(body);
  }

  @Post("goals/:id/progress")
  updateGoalProgress(
    @Param("id") id: string,
    @Body()
    body: {
      progress: number;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.goals.updateProgress({
      goalId: id,
      ...body
    });
  }

  @Get("goals")
  goalList() {
    return {
      summary: this.goals.summary(),
      items: this.goals.list()
    };
  }

  @Post("decisions")
  requestDecision(
    @Body()
    body: {
      sessionId: string;
      goalId?: string;
      question: string;
      contextIds?: string[];
      options: Array<Omit<
        BrainDecisionOption,
        "id" | "score" | "confidence"
      > & {
        score?: number;
        confidence?: number;
      }>;
      requiresHumanApproval: boolean;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.decisions.request(body);
  }

  @Post("decisions/:id/analyze")
  analyzeDecision(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.decisions.analyze({
      decisionId: id,
      ...body
    });
  }

  @Post("decisions/:id/approve")
  approveDecision(
    @Param("id") id: string,
    @Body()
    body: {
      identityId: string;
      approve: boolean;
      correlationId: string;
    }
  ) {
    return this.decisions.decideHumanApproval({
      decisionId: id,
      ...body
    });
  }

  @Get("decisions")
  decisionList() {
    return {
      summary: this.decisions.summary(),
      items: this.decisions.list()
    };
  }

  @Get("registry")
  registryList() {
    return {
      summary: this.registry.summary(),
      items: this.registry.list()
    };
  }

  @Post("registry")
  registerEntry(
    @Body()
    body: {
      entry: Omit<
        BrainRegistryEntry,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.register(
      body.entry,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
