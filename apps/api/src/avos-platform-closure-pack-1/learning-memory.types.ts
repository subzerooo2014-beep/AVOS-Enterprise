export type MemoryKind =
  | 'observation'
  | 'decision'
  | 'lesson'
  | 'pattern'
  | 'retrospective'
  | 'vision-alignment'
  | 'failure'
  | 'success';

export type MemoryStatus =
  | 'captured'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'superseded';

export interface LivingMemoryRecordInput {
  projectId: string;
  livingVisionId: string;
  kind: MemoryKind;
  title: string;
  content: string;
  source: string;
  tags?: string[];
  confidence?: number;
  strategic?: boolean;
  sensitive?: boolean;
  evidence?: string[];
}

export interface LivingMemoryRecord {
  id: string;
  projectId: string;
  livingVisionId: string;
  kind: MemoryKind;
  title: string;
  content: string;
  source: string;
  tags: string[];
  confidence: number;
  strategic: boolean;
  sensitive: boolean;
  evidence: string[];
  status: MemoryStatus;
  requiresHumanApproval: boolean;
  supersedes?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
}

export interface LearningProposalInput {
  projectId: string;
  livingVisionId: string;
  title: string;
  hypothesis: string;
  evidenceMemoryIds: string[];
  expectedImpact: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
}

export interface LearningProposal {
  id: string;
  projectId: string;
  livingVisionId: string;
  title: string;
  hypothesis: string;
  evidenceMemoryIds: string[];
  expectedImpact: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  status: 'draft' | 'under-review' | 'approved' | 'rejected' | 'blocked';
  requiresHumanApproval: true;
  governanceDecisionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRetrospectiveInput {
  projectId: string;
  livingVisionId: string;
  completedBy: string;
  summary: string;
  successes: string[];
  failures: string[];
  lessons: string[];
  reusableInsights: string[];
  followUpActions: string[];
}

export interface ProjectRetrospective {
  id: string;
  projectId: string;
  livingVisionId: string;
  completedBy: string;
  summary: string;
  successes: string[];
  failures: string[];
  lessons: string[];
  reusableInsights: string[];
  followUpActions: string[];
  publishedToSharedMemory: boolean;
  createdAt: string;
}

export interface Pack1Status {
  name: string;
  version: string;
  status: 'operational';
  layer: 'Learning & Living Memory';
  metrics: {
    memoryRecords: number;
    approvedMemories: number;
    pendingMemories: number;
    learningProposals: number;
    approvedLearningProposals: number;
    retrospectives: number;
    sharedLessons: number;
  };
  controls: {
    governanceBeforeLearning: true;
    humanFinalAuthority: true;
    humanApprovalForStrategicLearning: true;
    livingVisionRequired: true;
    projectRetrospectiveRequired: true;
    crossProjectKnowledgeSharing: true;
    noUnapprovedSelfModification: true;
  };
}