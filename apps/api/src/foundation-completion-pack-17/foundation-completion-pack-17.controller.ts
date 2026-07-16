import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack17Service } from "./foundation-completion-pack-17.service";
import { FoundationCapabilityRegistryService } from "./registry/foundation-capability-registry.service";
import { FoundationApiContractRegistryService } from "./contracts/foundation-api-contract-registry.service";
import { FoundationCapabilityDiscoveryService } from "./discovery/foundation-capability-discovery.service";
import { UnifiedFoundationGatewayService } from "./gateway/unified-foundation-gateway.service";
import { FoundationSdkDiagnosticsService } from "./diagnostics/foundation-sdk-diagnostics.service";
import { FoundationSdkHealthService } from "./health/foundation-sdk-health.service";
import { FoundationSdkAuditService } from "./observability/foundation-sdk-audit.service";
import {
  FoundationApiContract,
  FoundationCapabilityDiscoveryQuery,
  FoundationSdkCapability,
  FoundationSdkRequest,
  FoundationSdkStatus
} from "./foundation-pack-17.types";

@Controller("foundation-completion-v17")
export class FoundationCompletionPack17Controller {
  constructor(
    private readonly pack: FoundationCompletionPack17Service,
    private readonly capabilities: FoundationCapabilityRegistryService,
    private readonly contracts: FoundationApiContractRegistryService,
    private readonly discovery: FoundationCapabilityDiscoveryService,
    private readonly gateway: UnifiedFoundationGatewayService,
    private readonly diagnostics: FoundationSdkDiagnosticsService,
    private readonly health: FoundationSdkHealthService,
    private readonly audit: FoundationSdkAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("capabilities")
  capabilityList() {
    return {
      summary: this.capabilities.summary(),
      items: this.capabilities.list()
    };
  }

  @Get("capabilities/:id")
  capability(@Param("id") id: string) {
    return this.capabilities.get(id);
  }

  @Post("capabilities")
  registerCapability(
    @Body()
    body: {
      capability: Omit<
        FoundationSdkCapability,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.capabilities.register(
      body.capability,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("capabilities/:id/status")
  updateCapabilityStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: FoundationSdkStatus;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.capabilities.updateStatus(
      id,
      body.status,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("contracts")
  contractList() {
    return {
      summary: this.contracts.summary(),
      items: this.contracts.list()
    };
  }

  @Post("contracts")
  registerContract(
    @Body()
    body: {
      contract: Omit<
        FoundationApiContract,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.contracts.register(
      body.contract,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("discovery")
  discoverCapabilities(
    @Body()
    body: {
      query: FoundationCapabilityDiscoveryQuery;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.discovery.discover(
      body.query,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("gateway/execute")
  execute(
    @Body()
    body: FoundationSdkRequest
  ) {
    return this.gateway.execute(body);
  }

  @Post("gateway/batch")
  batch(
    @Body()
    body: {
      requests: FoundationSdkRequest[];
    }
  ) {
    return this.gateway.batch(body.requests);
  }

  @Post("diagnostics/run")
  runDiagnostics(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.diagnostics.validate(body);
  }

  @Get("diagnostics/findings")
  diagnosticFindings() {
    return {
      summary: this.diagnostics.summary(),
      items: this.diagnostics.list()
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

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
