export type EvidenceStatus =
  | 'captured'
  | 'validated'
  | 'rejected'
  | 'approved'
  | 'superseded';

export type ResearchStatus =
  | 'created'
  | 'collecting'
  | 'validating'
  | 'awaiting-approval'
  | 'approved'
  | 'rejected'
  | 'published';

export interface EvidenceInput {
  projectId: string;
  livingVisionId: string;
  title: string;
  sourceType: 'internal' | 'external' | 'human' | 'runtime';
  sourceReference: string;
  content: string;
  confidence: number;
  jurisdiction?: string;
  tags?: string[];
  capturedBy: string;
}

export interface EvidenceRecord {
  id: string;
  projectId: string;
  livingVisionId: string;
  title: string;
  sourceType: 'internal' | 'external' | 'human' | 'runtime';
  sourceReference: string;
  content: string;
  confidence: number;
  jurisdiction?: string;
  tags: string[];
  capturedBy: string;
  status: EvidenceStatus;
  qualityScore: number;
  validationNotes: string[];
  approvedBy?: string;
  supersedesId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchRequestInput {
  projectId: string;
  livingVisionId: string;
  teamId: string;
  workflowId?: string;
  question: string;
  requiredEvidenceCount?: number;
  requestedBy: string;
  strategic?: boolean;
}

export interface ResearchRequest {
  id: string;
  projectId: string;
  livingVisionId: string;
  teamId: string;
  workflowId?: string;
  question: string;
  requiredEvidenceCount: number;
  requestedBy: string;
  strategic: boolean;
  status: ResearchStatus;
  evidenceIds: string[];
  conclusion?: string;
  confidence: number;
  approvedBy?: string;
  publishedMemoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeQueryInput {
  projectId: string;
  livingVisionId: string;
  query: string;
  tags?: string[];
  minConfidence?: number;
}

export interface KnowledgeQueryResult {
  query: string;
  evidence: EvidenceRecord[];
  total: number;
  generatedAt: string;
}

export interface DataQualityResult {
  evidenceId: string;
  score: number;
  valid: boolean;
  checks: {
    sourceReference: boolean;
    contentLength: boolean;
    confidenceRange: boolean;
    projectAlignment: boolean;
    livingVisionAlignment: boolean;
    jurisdictionMetadata: boolean;
  };
  notes: string[];
}

export interface Pack4Status {
  name: string;
  version: string;
  status: 'operational';
  layer: 'Knowledge, Data & Research Integration Runtime';
  metrics: {
    evidenceRecords: number;
    validatedEvidence: number;
    approvedEvidence: number;
    rejectedEvidence: number;
    researchRequests: number;
    approvedResearch: number;
    publishedResearch: number;
    knowledgeQueries: number;
    averageEvidenceQuality: number;
    livingMemoryPublications: number;
  };
  controls: {
    evidenceBeforeConclusion: true;
    validatedSourcesOnly: true;
    humanApprovalForStrategicResearch: true;
    livingVisionAlignment: true;
    dataQualityGate: true;
    sourceTraceability: true;
    jurisdictionAwareness: true;
    knowledgeVersioning: true;
    sharedKnowledgePublication: true;
    executionKnowledgeBridge: true;
    noUnapprovedStrategicKnowledge: true;
  };
}