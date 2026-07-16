import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRuntimeService } from "../capability-runtime/capability-runtime.service";
import {
  CAPABILITY_ORCHESTRATION_PILLARS,
  CAPABILITY_ORCHESTRATION_VERSION,
} from "./capability-orchestration.registry";
import { CapabilityDiscoveryService } from "./capability-discovery.service";
import { CapabilityOrchestrationRegistryService } from "./capability-orchestration-registry.service";
import { CapabilityRoutingService } from "./capability-routing.service";
import {
  CapabilityOrchestrationExecutionRequest,
  CapabilityOrchestrationExecutionResult,
  CapabilityOrchestrationNode,
  CapabilityOrchestrationNodeResult,
  CapabilityOrchestrationSnapshot,
} from "./capability-orchestration.types";

@Injectable()
export class CapabilityOrchestrationService {
  private readonly executions: CapabilityOrchestrationExecutionResult[] = [];

  constructor(
    private readonly registry: CapabilityOrchestrationRegistryService,
    private readonly runtime: CapabilityRuntimeService,
    private readonly discovery: CapabilityDiscoveryService,
    private readonly routing: CapabilityRoutingService,
  ) {}

  framework() {
    return {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-3 Capability Orchestration",
      version: CAPABILITY_ORCHESTRATION_VERSION,
      architecturalPrinciple: "Foundation First",
      status: "OPERATIONAL",
      pillars: [...CAPABILITY_ORCHESTRATION_PILLARS],
      definitions: this.registry.list().length,
      routes: this.routing.list().length,
      executions: this.executions.length,
    };
  }

  discover(query: Parameters<CapabilityDiscoveryService["discover"]>[0]) {
    return this.discovery.discover(query);
  }

  registerRoute(
    input: Parameters<CapabilityRoutingService["register"]>[0],
  ) {
    return this.routing.register(input);
  }

  resolveRoute(routeKey: string, tags: string[] = []) {
    return this.routing.resolve(routeKey, tags);
  }

  async execute(
    request: CapabilityOrchestrationExecutionRequest,
  ): Promise<CapabilityOrchestrationExecutionResult> {
    const definition = this.registry.get(request.orchestrationKey);
    const startedAt = new Date().toISOString();
    const start = Date.now();
    const executionId = randomUUID();
    const correlationId = request.correlationId ?? randomUUID();

    if (!definition) {
      const result = this.failure(
        executionId,
        request.orchestrationKey,
        correlationId,
        startedAt,
        start,
        "ORCHESTRATION_NOT_FOUND",
      );
      this.executions.push(result);
      return result;
    }

    if (definition.status !== "ACTIVE") {
      const result = this.failure(
        executionId,
        definition.key,
        correlationId,
        startedAt,
        start,
        `ORCHESTRATION_NOT_ACTIVE_${definition.status}`,
      );
      this.executions.push(result);
      return result;
    }

    const plan = this.registry.plan(definition.key);
    const nodeResults: CapabilityOrchestrationNodeResult[] = [];
    const outputByNode = new Map<string, unknown>();

    try {
      for (const stage of plan.stages) {
        const stageNodes = stage.map((planned) =>
          definition.nodes.find((node) => node.id === planned.nodeId),
        ).filter((node): node is CapabilityOrchestrationNode => Boolean(node));

        const stageResults = await Promise.all(
          stageNodes.map((node) =>
            this.executeNode(
              node,
              request,
              correlationId,
              outputByNode,
              nodeResults,
            ),
          ),
        );

        for (const result of stageResults) {
          nodeResults.push(result);
          if (result.success) {
            outputByNode.set(result.nodeId, result.output);
          }
        }

        const blockingFailure = stageResults.find(
          (result) => !result.success && !result.skipped,
        );

        if (blockingFailure) {
          const failed = this.failure(
            executionId,
            definition.key,
            correlationId,
            startedAt,
            start,
            blockingFailure.error ?? "ORCHESTRATION_NODE_FAILED",
            nodeResults,
          );
          this.executions.push(failed);
          return failed;
        }
      }

      const completedAt = new Date().toISOString();
      const result: CapabilityOrchestrationExecutionResult = {
        success: true,
        executionId,
        orchestrationKey: definition.key,
        correlationId,
        status: "COMPLETED",
        durationMs: Date.now() - start,
        nodeResults,
        output:
          nodeResults.length > 0
            ? nodeResults[nodeResults.length - 1].output
            : request.payload,
        startedAt,
        completedAt,
      };

      this.executions.push(result);
      return structuredClone(result);
    } catch (error) {
      const failed = this.failure(
        executionId,
        definition.key,
        correlationId,
        startedAt,
        start,
        error instanceof Error ? error.message : "ORCHESTRATION_FAILED",
        nodeResults,
      );
      this.executions.push(failed);
      return failed;
    }
  }

  snapshot(): CapabilityOrchestrationSnapshot {
    const definitions = this.registry.list();
    const successful = this.executions.filter(
      (execution) => execution.success,
    );
    const failed = this.executions.filter(
      (execution) => !execution.success,
    );

    return {
      definitions: definitions.length,
      activeDefinitions: definitions.filter(
        (definition) => definition.status === "ACTIVE",
      ).length,
      routes: this.routing.list().length,
      executions: this.executions.length,
      successfulExecutions: successful.length,
      failedExecutions: failed.length,
      averageExecutionDurationMs:
        this.executions.length === 0
          ? 0
          : this.executions.reduce(
              (total, execution) => total + execution.durationMs,
              0,
            ) / this.executions.length,
      composedNodes: definitions.reduce(
        (total, definition) => total + definition.nodes.length,
        0,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  history() {
    return this.executions.map((execution) => structuredClone(execution));
  }

  private async executeNode(
    node: CapabilityOrchestrationNode,
    request: CapabilityOrchestrationExecutionRequest,
    correlationId: string,
    outputByNode: Map<string, unknown>,
    priorResults: CapabilityOrchestrationNodeResult[],
  ): Promise<CapabilityOrchestrationNodeResult> {
    const started = Date.now();

    const failedDependency = node.dependsOn.find((dependency) =>
      priorResults.some(
        (result) => result.nodeId === dependency && !result.success,
      ),
    );

    if (failedDependency) {
      return {
        nodeId: node.id,
        capabilityKey: node.capabilityKey,
        operation: node.operation,
        success: node.optional ?? false,
        skipped: true,
        fallbackUsed: false,
        durationMs: Date.now() - started,
        error: `DEPENDENCY_FAILED:${failedDependency}`,
      };
    }

    const load = this.runtime.load({
      capabilityKey: node.capabilityKey,
      tenantId: request.tenantId,
      environment: request.environment,
      lazy: false,
      isolation: "ISOLATED_CONTEXT",
    });

    const runtimeInstance =
      load.success && load.instance
        ? load.instance
        : load.reason === "RUNTIME_INSTANCE_ALREADY_EXISTS" && load.instance
          ? load.instance
          : undefined;

    if (!runtimeInstance) {
      return this.tryFallback(
        node,
        request,
        correlationId,
        outputByNode,
        started,
        load.reason ?? "RUNTIME_LOAD_FAILED",
      );
    }

    const input = {
      payload: request.payload,
      dependencyOutputs: Object.fromEntries(
        node.dependsOn.map((dependency) => [
          dependency,
          outputByNode.get(dependency),
        ]),
      ),
    };

    const execution = await this.runtime.execute({
      runtimeId: runtimeInstance.runtimeId,
      operation: node.operation,
      payload: input,
      correlationId,
    });

    if (!execution.success) {
      return this.tryFallback(
        node,
        request,
        correlationId,
        outputByNode,
        started,
        execution.error ?? "RUNTIME_EXECUTION_FAILED",
      );
    }

    return {
      nodeId: node.id,
      capabilityKey: node.capabilityKey,
      operation: node.operation,
      success: true,
      skipped: false,
      fallbackUsed: false,
      durationMs: Date.now() - started,
      output: execution.output,
    };
  }

  private async tryFallback(
    node: CapabilityOrchestrationNode,
    request: CapabilityOrchestrationExecutionRequest,
    correlationId: string,
    outputByNode: Map<string, unknown>,
    started: number,
    originalError: string,
  ): Promise<CapabilityOrchestrationNodeResult> {
    for (const fallbackNodeId of node.fallbackNodeIds ?? []) {
      const route = this.routing.resolve(fallbackNodeId);
      if (!route.success || !route.capabilityKey) continue;

      const load = this.runtime.load({
        capabilityKey: route.capabilityKey,
        tenantId: request.tenantId,
        environment: request.environment,
        lazy: false,
        isolation: "ISOLATED_CONTEXT",
      });

      const runtimeInstance =
        load.success && load.instance
          ? load.instance
          : load.reason === "RUNTIME_INSTANCE_ALREADY_EXISTS" && load.instance
            ? load.instance
            : undefined;

      if (!runtimeInstance) continue;

      const execution = await this.runtime.execute({
        runtimeId: runtimeInstance.runtimeId,
        operation: route.operation ?? node.operation,
        payload: {
          payload: request.payload,
          priorError: originalError,
          dependencyOutputs: Object.fromEntries(outputByNode),
        },
        correlationId,
      });

      if (execution.success) {
        return {
          nodeId: node.id,
          capabilityKey: route.capabilityKey,
          operation: route.operation ?? node.operation,
          success: true,
          skipped: false,
          fallbackUsed: true,
          durationMs: Date.now() - started,
          output: execution.output,
        };
      }
    }

    return {
      nodeId: node.id,
      capabilityKey: node.capabilityKey,
      operation: node.operation,
      success: node.optional ?? false,
      skipped: node.optional ?? false,
      fallbackUsed: false,
      durationMs: Date.now() - started,
      error: originalError,
    };
  }

  private failure(
    executionId: string,
    orchestrationKey: string,
    correlationId: string,
    startedAt: string,
    start: number,
    error: string,
    nodeResults: CapabilityOrchestrationNodeResult[] = [],
  ): CapabilityOrchestrationExecutionResult {
    return {
      success: false,
      executionId,
      orchestrationKey,
      correlationId,
      status: "FAILED",
      durationMs: Date.now() - start,
      nodeResults: structuredClone(nodeResults),
      error,
      startedAt,
      completedAt: new Date().toISOString(),
    };
  }
}