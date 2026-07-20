import { Injectable } from '@nestjs/common';
import { EvidenceRegistryService } from './evidence-registry.service';
import { KnowledgeQueryService } from './knowledge-query.service';
import { Pack4Status } from './knowledge-runtime.types';
import { ResearchOrchestratorService } from './research-orchestrator.service';

@Injectable()
export class Pack4Service {
  constructor(
    private readonly evidence: EvidenceRegistryService,
    private readonly research: ResearchOrchestratorService,
    private readonly queries: KnowledgeQueryService,
  ) {}

  status(): Pack4Status {
    const evidence = this.evidence.list();
    const research = this.research.list();

    const averageEvidenceQuality =
      evidence.length === 0
        ? 0
        : Math.round(
            evidence.reduce(
              (sum, item) => sum + item.qualityScore,
              0,
            ) / evidence.length,
          );

    return {
      name: 'AVOS Knowledge, Data & Research Integration Runtime',
      version: 'PC-P4-1.0.0',
      status: 'operational',
      layer: 'Knowledge, Data & Research Integration Runtime',
      metrics: {
        evidenceRecords: evidence.length,
        validatedEvidence: evidence.filter(
          (item) => item.status === 'validated',
        ).length,
        approvedEvidence: evidence.filter(
          (item) => item.status === 'approved',
        ).length,
        rejectedEvidence: evidence.filter(
          (item) => item.status === 'rejected',
        ).length,
        researchRequests: research.length,
        approvedResearch: research.filter(
          (item) => item.status === 'approved',
        ).length,
        publishedResearch: research.filter(
          (item) => item.status === 'published',
        ).length,
        knowledgeQueries: this.queries.metrics().queries,
        averageEvidenceQuality,
        livingMemoryPublications: research.reduce(
          (sum, item) => sum + item.publishedMemoryIds.length,
          0,
        ),
      },
      controls: {
        evidenceBeforeConclusion: true,
        validatedSourcesOnly: true,
        humanApprovalForStrategicResearch: true,
        livingVisionAlignment: true,
        dataQualityGate: true,
        sourceTraceability: true,
        jurisdictionAwareness: true,
        knowledgeVersioning: true,
        sharedKnowledgePublication: true,
        executionKnowledgeBridge: true,
        noUnapprovedStrategicKnowledge: true,
      },
    };
  }
}