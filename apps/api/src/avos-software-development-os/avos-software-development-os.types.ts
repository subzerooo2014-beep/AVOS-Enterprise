export type HumanDecisionStatus = 'not-required' | 'pending' | 'approved' | 'rejected';
export type ExecutionState =
  | 'draft'
  | 'planned'
  | 'awaiting-human-approval'
  | 'approved'
  | 'executing'
  | 'verified'
  | 'certified'
  | 'failed';

export interface SoftwareProjectRequest {
  projectName: string;
  vision: string;
  businessDomain: string;
  requestedBy: string;
  targetPlatforms?: Array<'api' | 'web' | 'mobile' | 'worker' | 'integration'>;
  constraints?: string[];
  strategicChange?: boolean;
}

export interface SoftwareBlueprint {
  id: string;
  projectName: string;
  vision: string;
  businessDomain: string;
  capabilities: string[];
  boundedContexts: string[];
  targetPlatforms: string[];
  qualityGates: string[];
  complianceRequirements: string[];
  humanAuthorityRequired: boolean;
  version: number;
  createdAt: string;
}

export interface WorkItem {
  id: string;
  team:
    | 'architecture'
    | 'backend'
    | 'frontend'
    | 'mobile'
    | 'data'
    | 'ai'
    | 'security'
    | 'quality'
    | 'devops'
    | 'documentation'
    | 'compliance';
  title: string;
  description: string;
  dependencies: string[];
  state: ExecutionState;
}

export interface SoftwareDevelopmentRun {
  id: string;
  request: SoftwareProjectRequest;
  blueprint: SoftwareBlueprint;
  workItems: WorkItem[];
  state: ExecutionState;
  humanDecision: HumanDecisionStatus;
  evidence: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}