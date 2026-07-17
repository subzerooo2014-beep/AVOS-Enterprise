import { Injectable } from "@nestjs/common";
import type {
  MeshRequest,
  MeshResult
} from "../contracts/enterprise-intelligence-mesh.contracts";
import { MeshEventService } from "./mesh-event.service";
import { MeshIdService } from "./mesh-id.service";
import { MeshMemoryService } from "./mesh-memory.service";
import { MeshPolicyService } from "./mesh-policy.service";
import { MeshRegistryService } from "./mesh-registry.service";
import { MeshTraceService } from "./mesh-trace.service";

@Injectable()
export class MeshRouterService {
  constructor(
    private readonly ids: MeshIdService,
    private readonly registry: MeshRegistryService,
    private readonly policy: MeshPolicyService,
    private readonly traces: MeshTraceService,
    private readonly events: MeshEventService,
    private readonly memory: MeshMemoryService
  ) {}

  execute(request: MeshRequest): MeshResult {
    const started = Date.now();
    const startedAt = this.ids.now();

    this.memory.saveRequest(request);
    this.traces.add(
      request.id,
      "accepted",
      "Mesh request accepted.",
      "enterprise-intelligence-mesh"
    );

    const policyResult = this.policy.evaluate(request);
    this.traces.add(
      request.id,
      "policy",
      policyResult.allowed
        ? "Mesh policy evaluation passed."
        : "Mesh policy evaluation rejected the request.",
      "mesh-policy",
      { reasons: policyResult.reasons }
    );

    if (!policyResult.allowed) {
      const failed: MeshResult = {
        requestId: request.id,
        route: request.route,
        action: request.action,
        status: "rejected",
        output: { policy: policyResult },
        explanation: policyResult.reasons,
        traces: this.traces.list(request.id),
        startedAt,
        completedAt: this.ids.now(),
        durationMs: Date.now() - started
      };
      this.memory.saveResult(failed);
      return failed;
    }

    const node = this.registry.findRoute(request.route, request.action);
    this.traces.add(
      request.id,
      "routing",
      node
        ? `Request routed to ${node.name}.`
        : `No explicit node action binding was found; mesh fallback route applied.`,
      node?.id ?? "mesh-fallback",
      { route: request.route, action: request.action }
    );

    const output = {
      accepted: true,
      routedNode: node?.id ?? "mesh-fallback",
      route: request.route,
      action: request.action,
      payload: request.payload,
      integrationMode: node ? "registered-node" : "mesh-fallback",
      nextRecommendedStep: this.nextStep(request)
    };

    this.events.publish({
      topic: `mesh.${request.route}`,
      type: "mesh.request.completed",
      source: "enterprise-intelligence-mesh",
      payload: {
        requestId: request.id,
        routedNode: output.routedNode,
        action: request.action
      },
      context: {
        correlationId: request.context.correlationId,
        causationId: request.context.causationId,
        traceId: request.context.traceId,
        source: "enterprise-intelligence-mesh",
        priority: request.context.priority,
        identity: {
          tenantId: request.context.identity.tenantId,
          actorId: request.context.identity.actorId,
          actorType: request.context.identity.actorType,
          roles: [...request.context.identity.roles]
        },
        metadata: { ...request.context.metadata }
      }
    });

    this.traces.add(
      request.id,
      "completed",
      "Mesh routing cycle completed.",
      node?.id ?? "mesh-fallback",
      { output }
    );

    const result: MeshResult = {
      requestId: request.id,
      route: request.route,
      action: request.action,
      status: "completed",
      output,
      explanation: [
        "Request passed mesh policy evaluation.",
        node
          ? `A compatible node was selected: ${node.name}.`
          : "The request used the controlled mesh fallback route.",
        "A completion event and full execution trace were recorded."
      ],
      traces: this.traces.list(request.id),
      startedAt,
      completedAt: this.ids.now(),
      durationMs: Date.now() - started
    };

    this.memory.saveResult(result);
    return result;
  }

  private nextStep(request: MeshRequest): string {
    switch (request.route) {
      case "decision":
        return "Connect the approved decision to an orchestration workflow.";
      case "orchestration":
        return "Publish workflow lifecycle signals through the nervous system.";
      case "knowledge":
        return "Attach retrieved knowledge to the requesting decision or capability.";
      case "capability":
        return "Resolve and invoke the selected capability contract.";
      case "event":
        return "Distribute the signal to registered subscribers.";
      case "kernel":
        return "Record kernel supervision and health results.";
      case "memory":
        return "Consolidate the record into enterprise memory.";
      case "ai":
        return "Record model reasoning metadata and human-control requirements.";
      default:
        return "Continue through the governed mesh lifecycle.";
    }
  }
}