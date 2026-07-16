import { Injectable } from "@nestjs/common";
import {
  FoundationSdkRequest,
  FoundationSdkResponse
} from "../foundation-pack-17.types";
import { FoundationCapabilityRegistryService } from "../registry/foundation-capability-registry.service";
import { FoundationApiContractRegistryService } from "../contracts/foundation-api-contract-registry.service";
import { FoundationSdkAuditService } from "../observability/foundation-sdk-audit.service";

@Injectable()
export class UnifiedFoundationGatewayService {
  constructor(
    private readonly capabilities: FoundationCapabilityRegistryService,
    private readonly contracts: FoundationApiContractRegistryService,
    private readonly audit: FoundationSdkAuditService
  ) {}

  execute(
    request: FoundationSdkRequest
  ): FoundationSdkResponse {
    const startedAt = Date.now();
    const capability = this.capabilities.get(
      request.capabilityId
    );

    if (capability.status !== "active") {
      return this.failure(
        request,
        capability,
        startedAt,
        `Capability is not active: ${capability.id}`
      );
    }

    if (
      !capability.operationTypes.includes(
        request.operationType
      )
    ) {
      return this.failure(
        request,
        capability,
        startedAt,
        `Operation type is not supported: ${request.operationType}`
      );
    }

    if (capability.contractId) {
      const contract = this.contracts.get(
        capability.contractId
      );

      if (!contract.active) {
        return this.failure(
          request,
          capability,
          startedAt,
          `Contract is inactive: ${contract.id}`
        );
      }
    }

    const response: FoundationSdkResponse = {
      requestId: request.requestId,
      capabilityId: capability.id,
      success: true,
      data: {
        accepted: true,
        operation: request.operation,
        operationType: request.operationType,
        payload: request.payload,
        context: request.context ?? {},
        providerModule: capability.providerModule,
        endpoint: capability.endpoint
      },
      metadata: {
        domain: capability.domain,
        version: capability.version,
        executedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt
      }
    };

    this.audit.record({
      correlationId: request.correlationId,
      category: "gateway",
      action: "foundation-sdk-request-executed",
      subjectId: request.requestId,
      actorIdentityId: request.actorIdentityId,
      outcome: "success",
      metadata: {
        capabilityId: capability.id,
        operation: request.operation,
        operationType: request.operationType
      }
    });

    return response;
  }

  batch(
    requests: FoundationSdkRequest[]
  ) {
    return {
      total: requests.length,
      responses: requests.map((request) =>
        this.execute(request)
      ),
      executedAt: new Date().toISOString()
    };
  }

  private failure(
    request: FoundationSdkRequest,
    capability: ReturnType<
      FoundationCapabilityRegistryService["get"]
    >,
    startedAt: number,
    error: string
  ): FoundationSdkResponse {
    this.audit.record({
      correlationId: request.correlationId,
      category: "gateway",
      action: "foundation-sdk-request-blocked",
      subjectId: request.requestId,
      actorIdentityId: request.actorIdentityId,
      outcome: "blocked",
      metadata: {
        capabilityId: capability.id,
        error
      }
    });

    return {
      requestId: request.requestId,
      capabilityId: capability.id,
      success: false,
      error,
      metadata: {
        domain: capability.domain,
        version: capability.version,
        executedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt
      }
    };
  }
}
