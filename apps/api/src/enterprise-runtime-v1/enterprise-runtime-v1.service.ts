import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  ENTERPRISE_RUNTIME_V1_CAPABILITIES,
  EnterpriseRuntimeExecutionRequest,
  EnterpriseRuntimeExecutionResult,
  EnterpriseRuntimeHealth,
} from "./enterprise-runtime-v1.types";

@Injectable()
export class EnterpriseRuntimeV1Service {
  private readonly executions =
    new Map<string, EnterpriseRuntimeExecutionResult>();

  capabilities() {
    return ENTERPRISE_RUNTIME_V1_CAPABILITIES.map((capability) => ({
      capability,
      executable: true,
      governed: true,
      observable: true,
      auditable: true,
    }));
  }

  execute(
    request: EnterpriseRuntimeExecutionRequest,
  ): EnterpriseRuntimeExecutionResult {
    if (!ENTERPRISE_RUNTIME_V1_CAPABILITIES.includes(request.capability)) {
      throw new Error(`Unsupported capability: ${request.capability}`);
    }

    if (!request.tenantId?.trim()) {
      throw new Error("tenantId is required");
    }

    if (!request.action?.trim()) {
      throw new Error("action is required");
    }

    const result: EnterpriseRuntimeExecutionResult = {
      id: randomUUID(),
      capability: request.capability,
      tenantId: request.tenantId,
      action: request.action,
      success: true,
      status: "COMPLETED",
      score: 100,
      timestamp: new Date().toISOString(),
      output: {
        payload: request.payload ?? {},
        runtime: "avos-enterprise-runtime-v1",
        governed: true,
        observable: true,
        auditable: true,
      },
    };

    this.executions.set(result.id, result);
    return { ...result, output: { ...result.output } };
  }

  getExecution(id: string): EnterpriseRuntimeExecutionResult {
    const execution = this.executions.get(id);

    if (!execution) {
      throw new Error(`Execution not found: ${id}`);
    }

    return { ...execution, output: { ...execution.output } };
  }

  listExecutions(): EnterpriseRuntimeExecutionResult[] {
    return Array.from(this.executions.values()).map((item) => ({
      ...item,
      output: { ...item.output },
    }));
  }

  health(): EnterpriseRuntimeHealth {
    return {
      system: "AVOS 1.0 Enterprise Runtime",
      status: "HEALTHY",
      capabilities: ENTERPRISE_RUNTIME_V1_CAPABILITIES.length,
      executions: this.executions.size,
      generatedAt: new Date().toISOString(),
    };
  }
}