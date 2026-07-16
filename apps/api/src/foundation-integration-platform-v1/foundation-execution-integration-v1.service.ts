import { Injectable, NotFoundException } from "@nestjs/common";
import { FoundationEventIntegrationV1Service } from "./foundation-event-integration-v1.service";
import type { FoundationExecutionRequestV1 } from "./foundation-integration-platform-v1.types";

@Injectable()
export class FoundationExecutionIntegrationV1Service {
  private readonly requests = new Map<string, FoundationExecutionRequestV1>();

  constructor(
    private readonly events: FoundationEventIntegrationV1Service,
  ) {}

  create(
    workflow: string,
    rules: string[],
    policy: string,
    context: Record<string, unknown>,
    aiTask?: string,
  ): FoundationExecutionRequestV1 {
    const now = new Date().toISOString();

    const request: FoundationExecutionRequestV1 = {
      id: `foundation-execution-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      workflow,
      rules: [...rules],
      policy,
      aiTask,
      context: { ...context },
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };

    this.requests.set(request.id, request);
    this.events.emit("foundation.execution.created", "execution-integration", {
      requestId: request.id,
      workflow,
      policy,
    });

    return this.clone(request);
  }

  execute(id: string): FoundationExecutionRequestV1 {
    const request = this.requireRequest(id);
    request.status = "RUNNING";
    request.updatedAt = new Date().toISOString();

    const denied =
      request.context["policyAllowed"] === false ||
      request.policy.toLowerCase().includes("deny");

    if (denied) {
      request.status = "DENIED";
      request.result = {
        policyDecision: "DENY",
      };
    } else {
      request.status = "COMPLETED";
      request.result = {
        workflowExecuted: request.workflow,
        rulesEvaluated: [...request.rules],
        policyDecision: "ALLOW",
        aiTaskExecuted: request.aiTask ?? null,
      };
    }

    request.updatedAt = new Date().toISOString();

    this.events.emit("foundation.execution.completed", "execution-integration", {
      requestId: request.id,
      status: request.status,
    });

    return this.clone(request);
  }

  fail(id: string, error: string): FoundationExecutionRequestV1 {
    const request = this.requireRequest(id);
    request.status = "FAILED";
    request.error = error;
    request.updatedAt = new Date().toISOString();
    return this.clone(request);
  }

  list(): FoundationExecutionRequestV1[] {
    return Array.from(this.requests.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.requests.size;
  }

  completedCount(): number {
    return this.list().filter((item) => item.status === "COMPLETED").length;
  }

  failedCount(): number {
    return this.list().filter((item) => item.status === "FAILED").length;
  }

  private requireRequest(id: string): FoundationExecutionRequestV1 {
    const request = this.requests.get(id);

    if (!request) {
      throw new NotFoundException(`Execution request '${id}' was not found.`);
    }

    return request;
  }

  private clone(item: FoundationExecutionRequestV1): FoundationExecutionRequestV1 {
    return {
      ...item,
      rules: [...item.rules],
      context: { ...item.context },
      result: item.result ? { ...item.result } : undefined,
    };
  }
}
