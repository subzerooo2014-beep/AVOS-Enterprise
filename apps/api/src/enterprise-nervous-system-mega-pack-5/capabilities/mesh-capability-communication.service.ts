import {
  ConflictException,
  Injectable
} from "@nestjs/common";
import { MeshInvocation } from "../enterprise-nervous-system-mega-pack-5.types";
import { MeshRegistryService } from "../registry/mesh-registry.service";
import { MeshRoutingService } from "../routing/mesh-routing.service";
import { MeshPolicyService } from "../policies/mesh-policy.service";
import { MeshCircuitBreakerService } from "../resilience/mesh-circuit-breaker.service";
import { MeshBulkheadService } from "../resilience/mesh-bulkhead.service";
import { MeshAuditService } from "../observability/mesh-audit.service";

@Injectable()
export class MeshCapabilityCommunicationService {
  private readonly invocations =
    new Map<string, MeshInvocation>();

  constructor(
    private readonly registry: MeshRegistryService,
    private readonly routing: MeshRoutingService,
    private readonly policies: MeshPolicyService,
    private readonly circuits: MeshCircuitBreakerService,
    private readonly bulkheads: MeshBulkheadService,
    private readonly audit: MeshAuditService
  ) {}

  invoke(input: {
    capabilityId: string;
    payload: unknown;
    policyId?: string;
    callerIdentityId: string;
    permissions: string[];
    humanApproved: boolean;
    correlationId: string;
    traceId?: string;
    simulateFailure?: boolean;
  }) {
    const policy = this.policies.get(
      input.policyId ?? "mesh-policy:standard"
    );

    if (!policy.active) {
      throw new ConflictException(`Mesh policy is inactive: ${policy.id}`);
    }

    if (policy.requireIdentity && !input.callerIdentityId) {
      throw new ConflictException("Caller identity is required.");
    }

    const route = this.routing.route({
      capabilityId: input.capabilityId,
      humanApproved: input.humanApproved,
      actorIdentityId: input.callerIdentityId,
      correlationId: input.correlationId
    });

    if (!route.selectedEndpointId) {
      throw new ConflictException({
        message: "Mesh route is not executable.",
        route
      });
    }

    const endpoint = this.registry.getEndpoint(route.selectedEndpointId);

    if (
      !endpoint.permissions.every(
        (permission) => input.permissions.includes(permission)
      )
    ) {
      throw new ConflictException(
        "Caller lacks endpoint permissions."
      );
    }

    this.circuits.assertAvailable(
      endpoint.id,
      policy.circuitResetMs
    );

    const invocation: MeshInvocation = {
      id: `mesh-invocation:${Date.now()}:${this.invocations.size + 1}`,
      capabilityId: input.capabilityId,
      endpointId: endpoint.id,
      callerIdentityId: input.callerIdentityId,
      payload: input.payload,
      correlationId: input.correlationId,
      traceId: input.traceId ?? `mesh-trace:${Date.now()}`,
      attempt: 0,
      status: "created",
      startedAt: new Date().toISOString()
    };

    this.invocations.set(invocation.id, invocation);

    this.bulkheads.acquire(
      endpoint.id,
      policy.bulkheadConcurrency
    );

    let finalInvocation = invocation;

    try {
      for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
        finalInvocation = {
          ...finalInvocation,
          attempt,
          status: "running"
        };

        this.invocations.set(finalInvocation.id, finalInvocation);

        try {
          if (input.simulateFailure) {
            throw new Error("Simulated mesh invocation failure.");
          }

          finalInvocation = {
            ...finalInvocation,
            status: "completed",
            result: {
              success: true,
              capabilityId: input.capabilityId,
              endpointId: endpoint.id,
              protocol: endpoint.protocol,
              address: endpoint.address
            },
            completedAt: new Date().toISOString()
          };

          this.invocations.set(finalInvocation.id, finalInvocation);
          this.circuits.recordSuccess(endpoint.id);

          this.audit.record({
            correlationId: input.correlationId,
            category: "invocation",
            action: "mesh-capability-invocation-completed",
            subjectId: finalInvocation.id,
            actorIdentityId: input.callerIdentityId,
            outcome: "success",
            metadata: {
              endpointId: endpoint.id,
              attempt
            }
          });

          return finalInvocation;
        }
        catch (error) {
          this.circuits.recordFailure(
            endpoint.id,
            policy.circuitFailureThreshold
          );

          finalInvocation = {
            ...finalInvocation,
            status:
              attempt >= policy.maxAttempts
                ? "failed"
                : "running",
            error:
              error instanceof Error
                ? error.message
                : String(error),
            completedAt:
              attempt >= policy.maxAttempts
                ? new Date().toISOString()
                : undefined
          };

          this.invocations.set(finalInvocation.id, finalInvocation);

          if (attempt >= policy.maxAttempts) {
            break;
          }
        }
      }

      this.audit.record({
        correlationId: input.correlationId,
        category: "invocation",
        action: "mesh-capability-invocation-failed",
        subjectId: finalInvocation.id,
        actorIdentityId: input.callerIdentityId,
        outcome: "failure",
        metadata: {
          endpointId: endpoint.id,
          attempts: finalInvocation.attempt,
          error: finalInvocation.error
        }
      });

      return finalInvocation;
    }
    finally {
      this.bulkheads.release(endpoint.id);
    }
  }

  list() {
    return Array.from(this.invocations.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      completed: items.filter((x) => x.status === "completed").length,
      failed: items.filter((x) => x.status === "failed").length,
      blocked: items.filter((x) => x.status === "blocked").length,
      timedOut: items.filter((x) => x.status === "timed-out").length
    };
  }
}
