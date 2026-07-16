import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack5Service } from "./enterprise-nervous-system-mega-pack-5.service";
import { MeshRegistryService } from "./registry/mesh-registry.service";
import { MeshDiscoveryService } from "./discovery/mesh-discovery.service";
import { MeshRoutingService } from "./routing/mesh-routing.service";
import { MeshCircuitBreakerService } from "./resilience/mesh-circuit-breaker.service";
import { MeshBulkheadService } from "./resilience/mesh-bulkhead.service";
import { MeshPolicyService } from "./policies/mesh-policy.service";
import { MeshCapabilityCommunicationService } from "./capabilities/mesh-capability-communication.service";
import { MeshHealthService } from "./health/mesh-health.service";
import { MeshAuditService } from "./observability/mesh-audit.service";
import {
  MeshCapabilityEndpoint,
  MeshCommunicationPolicy,
  MeshServiceRecord
} from "./enterprise-nervous-system-mega-pack-5.types";

@Controller("enterprise-nervous-system-v5")
export class EnterpriseNervousSystemMegaPack5Controller {
  constructor(
    private readonly pack: EnterpriseNervousSystemMegaPack5Service,
    private readonly registry: MeshRegistryService,
    private readonly discovery: MeshDiscoveryService,
    private readonly routing: MeshRoutingService,
    private readonly circuits: MeshCircuitBreakerService,
    private readonly bulkheads: MeshBulkheadService,
    private readonly policies: MeshPolicyService,
    private readonly communication: MeshCapabilityCommunicationService,
    private readonly health: MeshHealthService,
    private readonly audit: MeshAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("services")
  services() {
    return {
      summary: this.registry.summary().services,
      items: this.registry.listServices()
    };
  }

  @Post("services")
  registerService(
    @Body()
    body: {
      service: Omit<
        MeshServiceRecord,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.registerService(
      body.service,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("endpoints")
  endpoints() {
    return {
      summary: this.registry.summary().endpoints,
      items: this.registry.listEndpoints()
    };
  }

  @Post("endpoints")
  registerEndpoint(
    @Body()
    body: {
      endpoint: Omit<
        MeshCapabilityEndpoint,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.registerEndpoint(
      body.endpoint,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("discovery")
  discover(
    @Body()
    body: {
      capabilityId: string;
      protocol?: MeshCapabilityEndpoint["protocol"];
      zone?: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.discovery.discover(body);
  }

  @Post("routing")
  route(
    @Body()
    body: {
      capabilityId: string;
      protocol?: MeshCapabilityEndpoint["protocol"];
      zone?: string;
      humanApproved: boolean;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.routing.route(body);
  }

  @Get("routing")
  routingState() {
    return {
      summary: this.routing.summary(),
      items: this.routing.list()
    };
  }

  @Get("policies")
  policyList() {
    return {
      summary: this.policies.summary(),
      items: this.policies.list()
    };
  }

  @Post("policies")
  registerPolicy(
    @Body()
    body: {
      policy: Omit<
        MeshCommunicationPolicy,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.policies.register(
      body.policy,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("invoke")
  invoke(
    @Body()
    body: {
      capabilityId: string;
      payload: unknown;
      policyId?: string;
      callerIdentityId: string;
      permissions: string[];
      humanApproved: boolean;
      correlationId: string;
      traceId?: string;
      simulateFailure?: boolean;
    }
  ) {
    return this.communication.invoke(body);
  }

  @Get("invocations")
  invocations() {
    return {
      summary: this.communication.summary(),
      items: this.communication.list()
    };
  }

  @Get("circuits")
  circuitsState() {
    return {
      summary: this.circuits.summary(),
      items: this.circuits.list()
    };
  }

  @Get("bulkheads")
  bulkheadsState() {
    return {
      summary: this.bulkheads.summary(),
      items: this.bulkheads.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
