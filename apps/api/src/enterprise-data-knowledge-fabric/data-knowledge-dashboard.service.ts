import { Injectable } from '@nestjs/common';
import {
  DataKnowledgeDashboardSnapshot,
  ENTERPRISE_DATA_KNOWLEDGE_FABRIC_CAPABILITIES,
} from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class DataKnowledgeDashboardService {
  snapshot(input: {
    governanceScore?: number;
    dataQualityScore?: number;
    metadataCoverage?: number;
    lineageCoverage?: number;
    knowledgeGraphHealth?: number;
    memoryVaultHealth?: number;
  } = {}): DataKnowledgeDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      governanceScore: Math.max(
        0,
        Math.min(100, Math.round(input.governanceScore ?? 75)),
      ),
      dataQualityScore: Math.max(
        0,
        Math.min(100, Math.round(input.dataQualityScore ?? 75)),
      ),
      metadataCoverage: Math.max(
        0,
        Math.min(100, Math.round(input.metadataCoverage ?? 75)),
      ),
      lineageCoverage: Math.max(
        0,
        Math.min(100, Math.round(input.lineageCoverage ?? 75)),
      ),
      knowledgeGraphHealth: Math.max(
        0,
        Math.min(100, Math.round(input.knowledgeGraphHealth ?? 75)),
      ),
      memoryVaultHealth: Math.max(
        0,
        Math.min(100, Math.round(input.memoryVaultHealth ?? 75)),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_DATA_KNOWLEDGE_FABRIC_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as DataKnowledgeDashboardSnapshot['capabilityStatus'],
    };
  }
}