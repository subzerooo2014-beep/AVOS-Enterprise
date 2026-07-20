import { Injectable } from "@nestjs/common";
import {
  AgsUltimateRisk,
  AgsWorkflowStep,
} from "./adaptive-growth-ultimate.contracts";
import { AdaptiveGrowthCapabilityDispatcherService } from "./adaptive-growth-capability-dispatcher.service";
import { AdaptiveGrowthEnterpriseEventBusService } from "./adaptive-growth-enterprise-event-bus.service";
import { AdaptiveGrowthUltimateIdService } from "./adaptive-growth-ultimate-id.service";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";

@Injectable()
export class AdaptiveGrowthWorkflowEngineService {
  constructor(
    private readonly ids: AdaptiveGrowthUltimateIdService,
    private readonly store: AdaptiveGrowthUltimateStoreService,
    private readonly dispatcher: AdaptiveGrowthCapabilityDispatcherService,
    private readonly events: AdaptiveGrowthEnterpriseEventBusService,
  ) {}

  create(input: {
    name: string;
    objective: string;
    riskLevel?: AgsUltimateRisk;
    steps: AgsWorkflowStep[];
    requestedBy?: string;
  }) {
    if (!input.steps.length) {
      throw new Error("Workflow requires at least one step.");
    }

    const now = new Date().toISOString();
    const workflow = {
      id: this.ids.create("ags-workflow"),
      name: input.name,
      objective: input.objective,
      state: "created" as const,
      riskLevel: input.riskLevel ?? "medium",
      steps: input.steps,
      currentStep: 0,
      completedSteps: [],
      requestedBy: input.requestedBy ?? "human:khalifa",
      correlationId: this.ids.create("ags-correlation"),
      createdAt: now,
      updatedAt: now,
    };

    this.store.workflows.set(workflow.id, workflow);
    return workflow;
  }

  run(id: string) {
    const workflow = this.get(id);
    workflow.state = "running";
    workflow.updatedAt = new Date().toISOString();

    this.events.publish({
      type: "ags.workflow.started",
      source: "ags-workflow-engine",
      correlationId: workflow.correlationId,
      data: { workflowId: workflow.id },
    });

    try {
      while (workflow.currentStep < workflow.steps.length) {
        const step = workflow.steps[workflow.currentStep];

        this.dispatcher.dispatch({
          workflowId: workflow.id,
          capabilityKey: step.capabilityKey,
          operation: step.operation,
          payload: step.payload,
          requestedBy: workflow.requestedBy,
        });

        workflow.completedSteps.push(step.key);
        workflow.currentStep += 1;
        workflow.updatedAt = new Date().toISOString();
      }

      workflow.state = "completed";
      workflow.updatedAt = new Date().toISOString();

      this.events.publish({
        type: "ags.workflow.completed",
        source: "ags-workflow-engine",
        correlationId: workflow.correlationId,
        data: { workflowId: workflow.id },
      });

      return workflow;
    } catch (error) {
      workflow.state = "failed";
      workflow.failedStep = workflow.steps[workflow.currentStep]?.key;
      workflow.updatedAt = new Date().toISOString();

      this.events.publish({
        type: "ags.workflow.failed",
        source: "ags-workflow-engine",
        correlationId: workflow.correlationId,
        severity: "error",
        data: {
          workflowId: workflow.id,
          failedStep: workflow.failedStep,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      throw error;
    }
  }

  recover(id: string) {
    const workflow = this.get(id);

    if (workflow.state !== "failed" && workflow.state !== "waiting") {
      return {
        workflow,
        recovered: false,
        reason: "Workflow is not recoverable in its current state.",
      };
    }

    workflow.state = "running";
    workflow.updatedAt = new Date().toISOString();

    return {
      workflow: this.run(id),
      recovered: true,
    };
  }

  compensate(id: string) {
    const workflow = this.get(id);
    workflow.state = "compensating";

    const completed = [...workflow.completedSteps].reverse();
    const compensations = completed.map((stepKey) => {
      const step = workflow.steps.find((candidate) => candidate.key === stepKey);

      if (!step?.compensationOperation) {
        return {
          stepKey,
          compensated: false,
          reason: "No compensation operation declared.",
        };
      }

      const invocation = this.dispatcher.dispatch({
        workflowId: workflow.id,
        capabilityKey: step.capabilityKey,
        operation: step.compensationOperation,
        payload: step.payload,
        requestedBy: workflow.requestedBy,
      });

      return {
        stepKey,
        compensated: true,
        invocationId: invocation.id,
      };
    });

    workflow.state = "compensated";
    workflow.updatedAt = new Date().toISOString();

    return {
      workflow,
      compensations,
    };
  }

  get(id: string) {
    const workflow = this.store.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow not found: ${id}`);
    }
    return workflow;
  }

  list() {
    return [...this.store.workflows.values()];
  }

  status() {
    const workflows = this.list();
    return {
      status: "operational",
      total: workflows.length,
      running: workflows.filter((item) => item.state === "running").length,
      completed: workflows.filter((item) => item.state === "completed").length,
      failed: workflows.filter((item) => item.state === "failed").length,
      sagaReady: true,
      recoveryReady: true,
      compensationReady: true,
      longRunningWorkflowFoundation: true,
    };
  }
}