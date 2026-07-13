import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type {
  ProcessDefinition,
  ProcessExecution,
  ProcessNode,
} from "./core-flow-process-manager.types";
import { CoreFlowAuditService } from "./core-flow-audit.service";
import { CoreFlowSnapshotService } from "./core-flow-snapshot.service";
import { CoreFlowRulesService } from "./core-flow-rules.service";
import { CoreFlowTimeoutService } from "./core-flow-timeout.service";

@Injectable()
export class CoreFlowProcessManagerService {
  private readonly definitions = new Map<string, ProcessDefinition[]>();
  private readonly executions = new Map<string, ProcessExecution>();

  constructor(
    private readonly audit: CoreFlowAuditService,
    private readonly snapshots: CoreFlowSnapshotService,
    private readonly rules: CoreFlowRulesService,
    private readonly timeouts: CoreFlowTimeoutService,
  ) {}

  registerDefinition(dto: any) {
    const name = String(dto?.name ?? "").trim();
    if (!name) throw new BadRequestException("name is required.");

    const versions = this.definitions.get(name) ?? [];
    for (const version of versions) version.active = false;

    const definition: ProcessDefinition = {
      id: `definition_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      version: versions.length + 1,
      active: true,
      nodes: Array.isArray(dto?.nodes)
        ? dto.nodes.map((node: any, index: number) => ({
            id: String(node?.id ?? `node-${index + 1}`),
            name: String(node?.name ?? node?.id ?? `Node ${index + 1}`),
            dependsOn: Array.isArray(node?.dependsOn) ? node.dependsOn : [],
            status: "pending",
            input: node?.input,
            timeoutMs: node?.timeoutMs,
          }))
        : [],
      createdAt: new Date().toISOString(),
    };

    versions.push(definition);
    this.definitions.set(name, versions);
    return definition;
  }

  definitionsList() {
    return Array.from(this.definitions.values()).flat().reverse();
  }

  activeDefinition(name: string) {
    const definition = (this.definitions.get(name) ?? []).find((item) => item.active);
    if (!definition) throw new NotFoundException("Active process definition not found");
    return definition;
  }

  start(name: string, dto: any = {}) {
    const definition = this.activeDefinition(name);
    const execution: ProcessExecution = {
      id: `process_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      definitionId: definition.id,
      definitionVersion: definition.version,
      correlationId: String(dto?.correlationId ?? `${name}:${Date.now()}`),
      status: "running",
      nodes: definition.nodes.map((node) => ({ ...node, status: "pending" })),
      context: dto?.context ?? {},
      startedAt: new Date().toISOString(),
    };
    this.executions.set(execution.id, execution);
    this.refreshReadyNodes(execution);
    this.audit.write(execution.id, "process.started", {
      definitionId: definition.id,
      version: definition.version,
    });
    this.snapshots.create(execution.id, { ...execution });
    return execution;
  }

  findAllExecutions(query: any = {}) {
    return Array.from(this.executions.values())
      .filter((item) => !query.status || item.status === query.status)
      .slice()
      .reverse();
  }

  findExecution(id: string) {
    const execution = this.executions.get(id);
    if (!execution) throw new NotFoundException("Process execution not found");
    return execution;
  }

  refreshReadyNodes(execution: ProcessExecution) {
    for (const node of execution.nodes) {
      if (node.status !== "pending") continue;
      const dependenciesCompleted = node.dependsOn.every((dependencyId) => {
        const dependency = execution.nodes.find((item) => item.id === dependencyId);
        return dependency?.status === "completed" || dependency?.status === "skipped";
      });
      if (dependenciesCompleted) node.status = "ready";
    }
  }

  readyNodes(id: string) {
    const execution = this.findExecution(id);
    this.refreshReadyNodes(execution);
    return execution.nodes.filter((node) => node.status === "ready");
  }

  startNode(id: string, nodeId: string) {
    const execution = this.findExecution(id);
    const node = this.findNode(execution, nodeId);
    if (!["ready", "pending"].includes(node.status)) {
      throw new BadRequestException("Node is not ready.");
    }
    node.status = "running";
    node.startedAt = new Date().toISOString();
    if (node.timeoutMs) {
      this.timeouts.register(execution.id, node.id, node.timeoutMs);
    }
    this.audit.write(id, "process.node.started", { nodeId });
    this.snapshots.create(id, { ...execution });
    return execution;
  }

  completeNode(id: string, nodeId: string, output?: unknown) {
    const execution = this.findExecution(id);
    const node = this.findNode(execution, nodeId);
    node.status = "completed";
    node.output = output;
    node.completedAt = new Date().toISOString();
    this.timeouts.cancel(execution.id, node.id);

    if (output && typeof output === "object") {
      execution.context = {
        ...execution.context,
        ...(output as Record<string, unknown>),
      };
    }

    this.refreshReadyNodes(execution);
    if (execution.nodes.every((item) => ["completed", "skipped"].includes(item.status))) {
      execution.status = "completed";
      execution.completedAt = new Date().toISOString();
    }

    this.audit.write(id, "process.node.completed", { nodeId });
    this.snapshots.create(id, { ...execution });
    return execution;
  }

  failNode(id: string, nodeId: string, error: unknown) {
    const execution = this.findExecution(id);
    const node = this.findNode(execution, nodeId);
    node.status = "failed";
    node.error = error instanceof Error ? error.message : String(error);
    node.completedAt = new Date().toISOString();
    execution.status = "failed";
    execution.completedAt = new Date().toISOString();
    this.timeouts.cancel(execution.id, node.id);
    this.audit.write(id, "process.node.failed", { nodeId, error: node.error });
    this.snapshots.create(id, { ...execution });
    return execution;
  }

  applyRule(id: string, nodeId: string, rules: any[]) {
    const execution = this.findExecution(id);
    const node = this.findNode(execution, nodeId);
    const result = this.rules.evaluateAll(rules, execution.context);
    if (!result.passed) {
      node.status = "skipped";
      node.completedAt = new Date().toISOString();
      this.refreshReadyNodes(execution);
    }
    this.audit.write(id, "process.node.rule-evaluated", {
      nodeId,
      passed: result.passed,
    });
    this.snapshots.create(id, { ...execution });
    return { execution, result };
  }

  compensate(id: string, reason?: string) {
    const execution = this.findExecution(id);
    for (const node of execution.nodes.slice().reverse()) {
      if (node.status === "completed") node.status = "compensated";
    }
    execution.status = "compensated";
    execution.completedAt = new Date().toISOString();
    this.audit.write(id, "process.compensated", { reason });
    this.snapshots.create(id, { ...execution });
    return execution;
  }

  timeoutSweep() {
    const expired = this.timeouts.collectExpired();
    const affected: ProcessExecution[] = [];
    for (const timeout of expired) {
      const execution = this.executions.get(timeout.executionId);
      if (!execution) continue;
      const node = execution.nodes.find((item) => item.id === timeout.nodeId);
      if (!node || node.status !== "running") continue;
      node.status = "failed";
      node.error = "Node execution timed out.";
      node.completedAt = new Date().toISOString();
      execution.status = "timed-out";
      execution.completedAt = new Date().toISOString();
      affected.push(execution);
      this.audit.write(execution.id, "process.node.timed-out", {
        nodeId: timeout.nodeId,
      });
      this.snapshots.create(execution.id, { ...execution });
    }
    return {
      expired: expired.length,
      affected,
      executedAt: new Date().toISOString(),
    };
  }

  analytics() {
    const executions = Array.from(this.executions.values());
    const duration = (item: ProcessExecution) =>
      item.completedAt
        ? new Date(item.completedAt).getTime() - new Date(item.startedAt).getTime()
        : 0;
    const completed = executions.filter((item) => item.status === "completed");
    return {
      total: executions.length,
      running: executions.filter((item) => item.status === "running").length,
      completed: completed.length,
      failed: executions.filter((item) => item.status === "failed").length,
      timedOut: executions.filter((item) => item.status === "timed-out").length,
      compensated: executions.filter((item) => item.status === "compensated").length,
      averageDurationMs: completed.length
        ? Math.round(completed.reduce((sum, item) => sum + duration(item), 0) / completed.length)
        : 0,
      successRate: executions.length
        ? Number(((completed.length / executions.length) * 100).toFixed(2))
        : 100,
      timeoutMetrics: this.timeouts.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }

  private findNode(execution: ProcessExecution, nodeId: string): ProcessNode {
    const node = execution.nodes.find((item) => item.id === nodeId);
    if (!node) throw new NotFoundException("Process node not found");
    return node;
  }
}
