import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  GenesisBlueprint,
  GenesisGenerationPlan,
  GenesisHumanDecision,
  GenesisSession,
} from "../types/genesis-platform.types";
import { GenesisBlueprintRegistry } from "../registry/genesis-blueprint.registry";
import { GenesisSessionRegistry } from "../registry/genesis-session.registry";
import { BlueprintLoaderService } from "../blueprint/blueprint-loader.service";
import { BlueprintValidatorService } from "../blueprint/blueprint-validator.service";
import { BlueprintCompilerService } from "../blueprint/blueprint-compiler.service";
import { GenerationPlannerService } from "../planning/generation-planner.service";
import { GenerationPipelineService } from "./generation-pipeline.service";
import { HumanApprovalService } from "../governance/human-approval.service";
import { GenesisPolicyEngineService } from "../governance/policy-engine.service";
import { CapabilityFabricIntegration } from "../integration/capability-fabric.integration";

@Injectable()
export class GenesisRuntimeService {
  private readonly plans = new Map<string, GenesisGenerationPlan>();

  constructor(
    private readonly blueprintRegistry: GenesisBlueprintRegistry,
    private readonly sessionRegistry: GenesisSessionRegistry,
    private readonly loader: BlueprintLoaderService,
    private readonly validator: BlueprintValidatorService,
    private readonly compiler: BlueprintCompilerService,
    private readonly planner: GenerationPlannerService,
    private readonly pipeline: GenerationPipelineService,
    private readonly humanApproval: HumanApprovalService,
    private readonly policyEngine: GenesisPolicyEngineService,
    private readonly capabilityFabric: CapabilityFabricIntegration,
  ) {}

  createSession(input: GenesisBlueprint): {
    session: GenesisSession;
    plan: GenesisGenerationPlan;
    validation: ReturnType<BlueprintValidatorService["validate"]>;
    policy: ReturnType<GenesisPolicyEngineService["evaluate"]>;
    capabilities: ReturnType<CapabilityFabricIntegration["resolve"]>;
  } {
    const loaded = this.loader.load(input);
    const compiled = this.compiler.compile(loaded);
    const validation = this.validator.validate(compiled);
    if (!validation.valid) {
      throw new BadRequestException({
        message: "Blueprint validation failed.",
        validation,
      });
    }

    const policy = this.policyEngine.evaluate(compiled);
    if (!policy.passed) {
      throw new BadRequestException({
        message: "Blueprint policy validation failed.",
        policy,
      });
    }

    const capabilities = this.capabilityFabric.resolve(
      compiled.requestedCapabilities,
    );
    const storedBlueprint = this.blueprintRegistry.register(compiled);
    const plan = this.planner.createPlan(storedBlueprint);
    this.plans.set(plan.id, structuredClone(plan));

    const now = new Date().toISOString();
    const session: GenesisSession = {
      id: `genesis-session:${randomUUID()}`,
      blueprintId: storedBlueprint.id,
      stage: "awaiting-human-approval",
      approvalState: "awaiting-human-approval",
      createdAt: now,
      updatedAt: now,
      planId: plan.id,
      artifactIds: [],
      events: [
        {
          id: `event:session-created:${now}`,
          sessionId: "pending",
          type: "session-created",
          message: "Genesis session created and blocked for human approval.",
          timestamp: now,
          metadata: {
            blueprintId: storedBlueprint.id,
            planId: plan.id,
          },
        },
      ],
    };
    session.events[0].sessionId = session.id;

    return {
      session: this.sessionRegistry.save(session),
      plan,
      validation,
      policy,
      capabilities,
    };
  }

  decide(input: GenesisHumanDecision): GenesisSession {
    const current = this.sessionRegistry.get(input.sessionId);
    if (!current) {
      throw new NotFoundException(`Session not found: ${input.sessionId}`);
    }

    const updated = this.humanApproval.applyDecision(current, input);
    return this.sessionRegistry.save(updated);
  }

  execute(sessionId: string): GenesisSession {
    const session = this.sessionRegistry.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Session not found: ${sessionId}`);
    }

    if (session.approvalState !== "approved") {
      throw new BadRequestException(
        "Execution is blocked until explicit human approval.",
      );
    }

    if (!session.planId) {
      throw new BadRequestException("Session does not contain a plan.");
    }

    const plan = this.plans.get(session.planId);
    if (!plan) {
      throw new NotFoundException(`Plan not found: ${session.planId}`);
    }

    const blueprint = this.blueprintRegistry.get(session.blueprintId);
    if (!blueprint) {
      throw new NotFoundException(
        `Blueprint not found: ${session.blueprintId}`,
      );
    }

    const artifacts = this.pipeline.execute(blueprint, plan);
    const now = new Date().toISOString();

    const completed: GenesisSession = {
      ...session,
      stage: "completed",
      updatedAt: now,
      artifactIds: artifacts.map((artifact) => artifact.id),
      events: [
        ...session.events,
        {
          id: `event:execution-completed:${now}`,
          sessionId,
          type: "execution-completed",
          message: `${artifacts.length} artifacts generated and registered.`,
          timestamp: now,
          metadata: {
            generatedArtifacts: artifacts.length,
          },
        },
      ],
    };

    return this.sessionRegistry.save(completed);
  }

  listSessions(): GenesisSession[] {
    return this.sessionRegistry.list();
  }

  getSession(id: string): GenesisSession {
    const session = this.sessionRegistry.get(id);
    if (!session) throw new NotFoundException(`Session not found: ${id}`);
    return session;
  }
}
