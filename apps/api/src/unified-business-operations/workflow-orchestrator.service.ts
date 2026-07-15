import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowStatus,
} from "./unified-business-operations.types";
import { PROCESS_TEMPLATES } from "./unified-business-operations.registry";

@Injectable()
export class WorkflowOrchestratorService {
  private readonly definitions = new Map<string, WorkflowDefinition>();
  private readonly executions = new Map<string, WorkflowExecution>();

  installTemplates(tenantId: string): WorkflowDefinition[] {
    return PROCESS_TEMPLATES.map((template) => {
      const existing = Array.from(this.definitions.values()).find(
        (item) => item.tenantId === tenantId && item.key === template.key,
      );

      if (existing) {
        return this.cloneDefinition(existing);
      }

      const now = new Date().toISOString();
      const definition: WorkflowDefinition = {
        id: randomUUID(),
        tenantId,
        key: template.key,
        name: template.name,
        version: 1,
        steps: template.steps.map((step) => ({ ...step })),
        active: true,
        createdAt: now,
        updatedAt: now,
      };

      this.definitions.set(definition.id, definition);
      return this.cloneDefinition(definition);
    });
  }

  createDefinition(
    input: Omit<WorkflowDefinition, "id" | "createdAt" | "updatedAt">,
  ): WorkflowDefinition {
    const now = new Date().toISOString();
    const definition: WorkflowDefinition = {
      ...input,
      id: randomUUID(),
      steps: input.steps.map((step) => ({ ...step })),
      createdAt: now,
      updatedAt: now,
    };

    this.definitions.set(definition.id, definition);
    return this.cloneDefinition(definition);
  }

  start(
    workflowId: string,
    tenantId: string,
    referenceType: string,
    referenceId: string,
    context: Record<string, unknown>,
  ): WorkflowExecution {
    const definition = this.requireDefinition(workflowId);

    if (!definition.active || definition.tenantId !== tenantId) {
      throw new Error("Workflow is not active for tenant");
    }

    const now = new Date().toISOString();
    const execution: WorkflowExecution = {
      id: randomUUID(),
      tenantId,
      workflowId,
      referenceType,
      referenceId,
      currentStep: 0,
      status: "ACTIVE",
      context: { ...context },
      timeline: [
        {
          stepKey: definition.steps[0]?.key ?? "start",
          status: "STARTED",
          message: "Workflow execution started",
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.executions.set(execution.id, execution);
    return this.cloneExecution(execution);
  }

  advance(
    id: string,
    message: string,
  ): WorkflowExecution {
    const execution = this.requireExecution(id);
    const definition = this.requireDefinition(execution.workflowId);

    if (execution.status !== "ACTIVE") {
      throw new Error("Workflow execution is not active");
    }

    const current = definition.steps[execution.currentStep];

    if (current?.requiresApproval) {
      execution.status = "PAUSED";
      execution.timeline.push({
        stepKey: current.key,
        status: "APPROVAL_REQUIRED",
        message: "Human approval required",
        createdAt: new Date().toISOString(),
      });
    } else {
      execution.currentStep += 1;

      if (execution.currentStep >= definition.steps.length) {
        execution.status = "COMPLETED";
      }

      execution.timeline.push({
        stepKey:
          definition.steps[execution.currentStep]?.key ??
          current?.key ??
          "completed",
        status: execution.status,
        message,
        createdAt: new Date().toISOString(),
      });
    }

    execution.updatedAt = new Date().toISOString();
    this.executions.set(id, execution);
    return this.cloneExecution(execution);
  }

  approve(id: string): WorkflowExecution {
    const execution = this.requireExecution(id);
    const definition = this.requireDefinition(execution.workflowId);

    if (execution.status !== "PAUSED") {
      throw new Error("Workflow is not waiting for approval");
    }

    execution.currentStep += 1;
    execution.status =
      execution.currentStep >= definition.steps.length
        ? "COMPLETED"
        : "ACTIVE";
    execution.timeline.push({
      stepKey:
        definition.steps[execution.currentStep]?.key ?? "completed",
      status: "APPROVED",
      message: "Human approval completed",
      createdAt: new Date().toISOString(),
    });
    execution.updatedAt = new Date().toISOString();

    this.executions.set(id, execution);
    return this.cloneExecution(execution);
  }

  updateStatus(id: string, status: WorkflowStatus): WorkflowExecution {
    const execution = this.requireExecution(id);
    execution.status = status;
    execution.updatedAt = new Date().toISOString();
    this.executions.set(id, execution);
    return this.cloneExecution(execution);
  }

  dashboard() {
    const executions = Array.from(this.executions.values());

    return {
      definitions: this.definitions.size,
      executions: executions.length,
      active: executions.filter((item) => item.status === "ACTIVE").length,
      paused: executions.filter((item) => item.status === "PAUSED").length,
      completed: executions.filter((item) => item.status === "COMPLETED").length,
      failed: executions.filter((item) => item.status === "FAILED").length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireDefinition(id: string): WorkflowDefinition {
    const definition = this.definitions.get(id);
    if (!definition) {
      throw new Error(`Workflow definition not found: ${id}`);
    }
    return definition;
  }

  private requireExecution(id: string): WorkflowExecution {
    const execution = this.executions.get(id);
    if (!execution) {
      throw new Error(`Workflow execution not found: ${id}`);
    }
    return execution;
  }

  private cloneDefinition(value: WorkflowDefinition): WorkflowDefinition {
    return {
      ...value,
      steps: value.steps.map((step) => ({ ...step })),
    };
  }

  private cloneExecution(value: WorkflowExecution): WorkflowExecution {
    return {
      ...value,
      context: { ...value.context },
      timeline: value.timeline.map((entry) => ({ ...entry })),
    };
  }
}