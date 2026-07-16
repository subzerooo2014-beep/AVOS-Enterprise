import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseBrainMegaPack5Service } from "./enterprise-brain-mega-pack-5.service";
import { BrainAgentRegistryService } from "./agents/brain-agent-registry.service";
import { BrainSharedContextService } from "./context/brain-shared-context.service";
import { BrainDelegationService } from "./delegation/brain-delegation.service";
import { BrainConsensusService } from "./consensus/brain-consensus.service";
import { BrainConflictResolutionService } from "./conflict/brain-conflict-resolution.service";
import { BrainCoordinationRuntimeService } from "./coordination/brain-coordination-runtime.service";
import { BrainSupervisorService } from "./supervisor/brain-supervisor.service";
import { BrainAgentGovernanceService } from "./governance/brain-agent-governance.service";
import { BrainMultiAgentHealthService } from "./health/brain-multi-agent-health.service";
import { BrainMultiAgentAuditService } from "./observability/brain-multi-agent-audit.service";
import {
  BrainAgentDescriptor,
  BrainConflictRecord,
  BrainCoordinationTask,
  BrainSupervisorDecision
} from "./enterprise-brain-mega-pack-5.types";

@Controller("enterprise-brain-v5")
export class EnterpriseBrainMegaPack5Controller {
  constructor(
    private readonly pack: EnterpriseBrainMegaPack5Service,
    private readonly agents: BrainAgentRegistryService,
    private readonly context: BrainSharedContextService,
    private readonly delegation: BrainDelegationService,
    private readonly consensus: BrainConsensusService,
    private readonly conflicts: BrainConflictResolutionService,
    private readonly coordination: BrainCoordinationRuntimeService,
    private readonly supervisor: BrainSupervisorService,
    private readonly governance: BrainAgentGovernanceService,
    private readonly health: BrainMultiAgentHealthService,
    private readonly audit: BrainMultiAgentAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("agents")
  agentList() {
    return {
      summary: this.agents.summary(),
      items: this.agents.list()
    };
  }

  @Post("agents")
  registerAgent(
    @Body()
    body: {
      agent: Omit<
        BrainAgentDescriptor,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.agents.register(
      body.agent,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("agents/candidates")
  findCandidates(
    @Body()
    body: {
      taskType: string;
      requiredCapabilities: string[];
      requiredPermissions?: string[];
    }
  ) {
    return this.agents.findCandidates(body);
  }

  @Post("shared-context")
  setSharedContext(
    @Body()
    body: {
      scopeId: string;
      key: string;
      value: unknown;
      visibleToAgentIds: string[];
      writableByAgentIds: string[];
      sensitive: boolean;
      sourceAgentId?: string;
      sourceIdentityId?: string;
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.context.set(body);
  }

  @Get("shared-context")
  sharedContextList() {
    return {
      summary: this.context.summary(),
      items: this.context.list()
    };
  }

  @Post("delegations")
  createDelegation(
    @Body()
    body: {
      coordinationId: string;
      taskId: string;
      fromAgentId: string;
      toAgentId: string;
      reason: string;
      requiredCapabilities: string[];
      contextIds: string[];
      priority: "low" | "medium" | "high" | "critical";
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.delegation.create(body);
  }

  @Post("delegations/:id/accept")
  acceptDelegation(
    @Param("id") id: string,
    @Body()
    body: {
      agentId: string;
    }
  ) {
    return this.delegation.accept({
      delegationId: id,
      ...body
    });
  }

  @Post("delegations/:id/complete")
  completeDelegation(
    @Param("id") id: string,
    @Body()
    body: {
      agentId: string;
      result: unknown;
    }
  ) {
    return this.delegation.complete({
      delegationId: id,
      ...body
    });
  }

  @Get("delegations")
  delegationList() {
    return {
      summary: this.delegation.summary(),
      items: this.delegation.list()
    };
  }

  @Post("consensus")
  createConsensus(
    @Body()
    body: {
      subjectId: string;
      question: string;
      optionIds: string[];
      requiredAgentIds: string[];
      minimumParticipation: number;
      approvalThreshold: number;
      requiresHumanApproval: boolean;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.consensus.create(body);
  }

  @Post("consensus/:id/votes")
  voteConsensus(
    @Param("id") id: string,
    @Body()
    body: {
      agentId: string;
      optionId: string;
      confidence: number;
      rationale: string;
      conditions?: string[];
    }
  ) {
    return this.consensus.vote({
      consensusId: id,
      ...body
    });
  }

  @Post("consensus/:id/decide")
  decideConsensus(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.consensus.decide({
      consensusId: id,
      ...body
    });
  }

  @Post("consensus/:id/approve")
  approveConsensus(
    @Param("id") id: string,
    @Body()
    body: {
      approvedByIdentityId: string;
      approve: boolean;
    }
  ) {
    return this.consensus.approveHuman({
      consensusId: id,
      ...body
    });
  }

  @Get("consensus")
  consensusList() {
    return {
      summary: this.consensus.summary(),
      items: this.consensus.list()
    };
  }

  @Post("conflicts")
  createConflict(
    @Body()
    body: {
      subjectId: string;
      agentIds: string[];
      conflictType: BrainConflictRecord["conflictType"];
      description: string;
      severity: BrainConflictRecord["severity"];
      proposals: BrainConflictRecord["proposals"];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.conflicts.create(body);
  }

  @Post("conflicts/:id/resolve")
  resolveConflict(
    @Param("id") id: string,
    @Body()
    body: {
      resolution: string;
      resolvedBy: BrainConflictRecord["resolvedBy"];
      approvedByIdentityId?: string;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.conflicts.resolve({
      conflictId: id,
      ...body
    });
  }

  @Get("conflicts")
  conflictList() {
    return {
      summary: this.conflicts.summary(),
      items: this.conflicts.list()
    };
  }

  @Post("coordination/plans")
  createCoordinationPlan(
    @Body()
    body: {
      name: string;
      objective: string;
      tasks: Array<Omit<
        BrainCoordinationTask,
        "assignedAgentId" | "status" | "result" | "error" | "startedAt" | "completedAt"
      >>;
      sharedContextIds?: string[];
      supervisorAgentId: string;
      createdByIdentityId: string;
      correlationId: string;
      traceId?: string;
    }
  ) {
    return this.coordination.create(body);
  }

  @Post("coordination/plans/:planId/tasks/:taskId/assign")
  assignTask(
    @Param("planId") planId: string,
    @Param("taskId") taskId: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.coordination.assign({
      planId,
      taskId,
      ...body
    });
  }

  @Post("coordination/plans/:id/approve")
  approveCoordinationPlan(
    @Param("id") id: string,
    @Body()
    body: {
      approvedByIdentityId: string;
    }
  ) {
    return this.coordination.approve({
      planId: id,
      ...body
    });
  }

  @Post("coordination/plans/:id/execute")
  executeCoordinationPlan(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.coordination.execute({
      planId: id,
      ...body
    });
  }

  @Get("coordination/plans")
  coordinationPlanList() {
    return {
      summary: this.coordination.summary(),
      items: this.coordination.list()
    };
  }

  @Post("supervisor/decisions")
  proposeSupervisorDecision(
    @Body()
    body: {
      subjectId: string;
      action: BrainSupervisorDecision["action"];
      targetAgentId?: string;
      targetTaskId?: string;
      rationale: string;
      confidence: number;
      riskScore: number;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.supervisor.propose(body);
  }

  @Post("supervisor/decisions/:id/approve")
  approveSupervisorDecision(
    @Param("id") id: string,
    @Body()
    body: {
      approvedByIdentityId: string;
      approve: boolean;
    }
  ) {
    return this.supervisor.approve({
      decisionId: id,
      ...body
    });
  }

  @Post("supervisor/decisions/:id/execute")
  executeSupervisorDecision(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
    }
  ) {
    return this.supervisor.execute({
      decisionId: id,
      ...body
    });
  }

  @Get("supervisor/decisions")
  supervisorDecisionList() {
    return {
      summary: this.supervisor.summary(),
      items: this.supervisor.list()
    };
  }

  @Post("governance/assess")
  assessGovernance(
    @Body()
    body: {
      subjectId: string;
      checks: Record<string, boolean>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.governance.assess(body);
  }

  @Get("governance/policies")
  governancePolicies() {
    return {
      summary: this.governance.summary(),
      items: this.governance.list()
    };
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
