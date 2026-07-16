import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousWorkflowDefinition } from "../enterprise-nervous-system-mega-pack-3.types";
import { NervousWorkflowAuditService } from "../observability/nervous-workflow-audit.service";

@Injectable()
export class NervousWorkflowRegistryService {
  private readonly workflows =
    new Map<string, NervousWorkflowDefinition>();

  constructor(
    private readonly audit: NervousWorkflowAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.workflows.values());
  }

  get(id: string) {
    const workflow = this.workflows.get(id);

    if (!workflow) {
      throw new NotFoundException(`Nervous workflow not found: ${id}`);
    }

    return workflow;
  }

  register(
    input: Omit<NervousWorkflowDefinition, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.workflows.has(input.id)) {
      throw new ConflictException(
        `Nervous workflow already exists: ${input.id}`
      );
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new ConflictException(
        `Invalid workflow version: ${input.version}`
      );
    }

    const stepIds = new Set(input.steps.map((step) => step.id));

    if (stepIds.size !== input.steps.length) {
      throw new ConflictException("Workflow contains duplicate step ids.");
    }

    for (const step of input.steps) {
      for (const dependencyId of step.dependencies) {
        if (!stepIds.has(dependencyId)) {
          throw new ConflictException(
            `Workflow dependency not found: ${dependencyId}`
          );
        }
      }

      if (
        step.compensationStepId &&
        !stepIds.has(step.compensationStepId)
      ) {
        throw new ConflictException(
          `Compensation step not found: ${step.compensationStepId}`
        );
      }
    }

    const now = new Date().toISOString();

    const workflow: NervousWorkflowDefinition = {
      ...input,
      triggerIds: Array.from(new Set(input.triggerIds)),
      steps: input.steps
        .map((step) => ({
          ...step,
          dependencies: Array.from(new Set(step.dependencies)),
          timeoutMs: Math.max(100, step.timeoutMs),
          retryAttempts: Math.max(0, step.retryAttempts)
        }))
        .sort((left, right) => left.order - right.order),
      maxExecutionMinutes: Math.max(1, input.maxExecutionMinutes),
      createdAt: now,
      updatedAt: now
    };

    this.workflows.set(workflow.id, workflow);

    this.audit.record({
      correlationId: context.correlationId,
      category: "workflow",
      action: "nervous-workflow-registered",
      subjectId: workflow.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: workflow.version,
        steps: workflow.steps.length,
        reversible: workflow.reversible
      }
    });

    return workflow;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.status === "active").length,
      paused: items.filter((x) => x.status === "paused").length,
      reversible: items.filter((x) => x.reversible).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const workflow: NervousWorkflowDefinition = {
      id: "workflow:critical-governance-response",
      name: "Critical Governance Response",
      description:
        "Coordinates detection, approval, response, and recovery for critical governance signals.",
      version: "1.0.0",
      triggerIds: ["trigger:critical-governance-response"],
      steps: [
        {
          id: "step:assess",
          name: "Assess Governance Signal",
          description: "Assess signal severity and context.",
          type: "decision",
          order: 1,
          dependencies: [],
          inputMapping: {},
          outputKey: "assessment",
          timeoutMs: 10000,
          retryAttempts: 2,
          requiresHumanApproval: false,
          metadata: {}
        },
        {
          id: "step:approve",
          name: "Human Approval Gate",
          description: "Require human authority before critical action.",
          type: "approval",
          order: 2,
          dependencies: ["step:assess"],
          inputMapping: {},
          outputKey: "approval",
          timeoutMs: 600000,
          retryAttempts: 0,
          requiresHumanApproval: true,
          metadata: {}
        },
        {
          id: "step:respond",
          name: "Execute Governed Response",
          description: "Execute the approved governance response.",
          type: "service",
          order: 3,
          dependencies: ["step:approve"],
          inputMapping: {},
          outputKey: "response",
          timeoutMs: 30000,
          retryAttempts: 3,
          requiresHumanApproval: false,
          compensationStepId: "step:rollback-response",
          metadata: {}
        },
        {
          id: "step:rollback-response",
          name: "Rollback Governed Response",
          description: "Compensates the governed response.",
          type: "compensation",
          order: 4,
          dependencies: [],
          inputMapping: {},
          timeoutMs: 30000,
          retryAttempts: 2,
          requiresHumanApproval: false,
          metadata: {}
        }
      ],
      status: "active",
      reversible: true,
      maxExecutionMinutes: 30,
      createdAt: now,
      updatedAt: now
    };

    this.workflows.set(workflow.id, workflow);
  }
}
