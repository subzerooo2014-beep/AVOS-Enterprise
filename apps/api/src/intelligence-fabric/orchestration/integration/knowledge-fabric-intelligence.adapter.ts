import { Injectable } from "@nestjs/common";
import {
  UnifiedIntelligenceEvidence,
  UnifiedIntelligenceRequest,
} from "../contracts/unified-intelligence-orchestration.contracts";

@Injectable()
export class KnowledgeFabricIntelligenceAdapter {
  enrich(
    request: UnifiedIntelligenceRequest,
  ): UnifiedIntelligenceRequest {
    const suppliedEvidence = request.evidence ?? [];

    const contextualEvidence: UnifiedIntelligenceEvidence = {
      id: `knowledge-context:${Date.now()}`,
      source: "knowledge-fabric",
      title: "Knowledge Fabric contextual evidence",
      content: `Knowledge context prepared for objective: ${request.objective}.`,
      trustScore: 1,
      metadata: {
        adapter: "knowledge-fabric-intelligence",
        generated: true,
      },
    };

    return {
      ...request,
      evidence: [...suppliedEvidence, contextualEvidence],
      context: {
        ...(request.context ?? {}),
        knowledgeFabricIntegrated: true,
      },
    };
  }
}