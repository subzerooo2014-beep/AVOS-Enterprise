export type ArchitectureComponentKind =
  | 'module'
  | 'controller'
  | 'service'
  | 'provider'
  | 'entity'
  | 'dto'
  | 'interface'
  | 'repository'
  | 'engine'
  | 'registry'
  | 'runtime'
  | 'fabric'
  | 'foundation'
  | 'pack'
  | 'other';

export interface ArchitectureComponent {
  id: string;
  name: string;
  kind: ArchitectureComponentKind;
  relativePath: string;
  extension: string;
  sizeBytes: number;
  modifiedAt: string;
  imports: string[];
  exportedSymbols: string[];
}

export interface ArchitectureInventory {
  generatedAt: string;
  root: string;
  totalFiles: number;
  totalComponents: number;
  byKind: Record<string, number>;
  components: ArchitectureComponent[];
}

export interface DuplicateGroup {
  key: string;
  confidence: number;
  reason: string;
  components: Array<Pick<ArchitectureComponent, 'id' | 'name' | 'kind' | 'relativePath'>>;
}

export interface DependencyEdge {
  from: string;
  to: string;
  importExpression: string;
  resolved: boolean;
}

export interface ArchitectureHealth {
  score: number;
  status: 'healthy' | 'attention-required' | 'critical';
  metrics: {
    components: number;
    duplicateGroups: number;
    unresolvedImports: number;
    circularDependencies: number;
    averageImportsPerComponent: number;
    reuseRatio: number;
  };
  findings: string[];
}

export interface ConsolidationRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'merge' | 'reuse' | 'rename' | 'boundary-review' | 'dependency-repair';
  title: string;
  rationale: string;
  affectedComponents: string[];
  requiresHumanApproval: true;
}

export interface GapFinding {
  id: string;
  severity: 'informational' | 'recommended' | 'blocking';
  capability: string;
  evidence: string;
  recommendation: string;
  requiresHumanApproval: true;
}

export interface FullScanResult {
  pack: 'AVOS Platform Closure Pack 0';
  version: 'PC-P0-1.0.0';
  status: 'completed';
  generatedAt: string;
  inventory: ArchitectureInventory;
  duplicates: DuplicateGroup[];
  dependencies: {
    edges: DependencyEdge[];
    unresolved: DependencyEdge[];
    circularDependencies: string[][];
  };
  health: ArchitectureHealth;
  consolidation: ConsolidationRecommendation[];
  gaps: GapFinding[];
  governance: {
    noNewComponentsBeforeInventoryReview: true;
    humanFinalAuthority: true;
    humanApprovalGate: true;
    livingVisionRequired: true;
    projectRetrospectiveRequired: true;
  };
}