import { Injectable } from "@nestjs/common";
import { UnifiedIntelligenceRequest } from "../contracts/unified-intelligence-orchestration.contracts";

@Injectable()
export class CapabilityFabricIntelligenceAdapter {
  enrich(
    request: UnifiedIntelligenceRequest,
  ): UnifiedIntelligenceRequest {
    return {
      ...request,
      context: {
        ...(request.context ?? {}),
        capabilityFabricIntegrated: true,
        requestedCapability: request.capability ?? "general-intelligence",
      },
    };
  }
}