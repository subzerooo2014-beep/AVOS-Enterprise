export const ENTERPRISE_AI_COGNITIVE_CORE_CAPABILITIES = [
  'enterprise-cognitive-engine',
  'autonomous-reasoning-engine',
  'knowledge-synthesis-engine',
  'enterprise-memory-graph-v2',
  'long-term-enterprise-memory',
  'multi-agent-collaboration-core',
  'autonomous-goal-management',
  'enterprise-learning-engine',
  'decision-explainability-engine',
  'strategic-planning-intelligence',
  'cognitive-workflow-orchestrator',
  'enterprise-cognitive-dashboard',
  'cognitive-analytics-center',
] as const;

export type EnterpriseAiCognitiveCoreCapability =
  (typeof ENTERPRISE_AI_COGNITIVE_CORE_CAPABILITIES)[number];

export interface CognitiveSignal {
  id: string;
  domain: string;
  source: string;
  value: number;
  confidence: number;
  observedAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface CognitiveHypothesis {
  id: string;
  statement: string;
  evidence: string[];
  contradictions: string[];
  confidence: number;
  score: number;
}

export interface KnowledgeFragment {
  id: string;
  domain: string;
  concept: string;
  content: string;
  confidence: number;
  source: string;
}

export interface MemoryNode {
  id: string;
  type: string;
  label: string;
  importance: number;
  lastAccessedAt: string;
  attributes: Record<string, string | number | boolean>;
}

export interface MemoryEdge {
  id: string;
  from: string;
  to: string;
  relation: string;
  weight: number;
}

export interface AgentContribution {
  agentId: string;
  role: string;
  recommendation: string;
  confidence: number;
  rationale: string[];
}

export interface AutonomousGoal {
  id: string;
  title: string;
  owner: string;
  priority: number;
  targetValue: number;
  currentValue: number;
  dueDate: string;
  dependencies: string[];
}

export interface LearningObservation {
  id: string;
  context: string;
  expectedOutcome: number;
  actualOutcome: number;
  confidence: number;
  observedAt: string;
}

export interface StrategicPlan {
  id: string;
  objective: string;
  horizonDays: number;
  priorities: string[];
  actions: string[];
  risks: string[];
  expectedImpact: number;
}

export interface ExplainableDecision {
  decision: string;
  confidence: number;
  evidence: string[];
  counterEvidence: string[];
  reasoningSteps: string[];
  limitations: string[];
}

export interface CognitiveDashboardSnapshot {
  generatedAt: string;
  cognitionScore: number;
  reasoningConfidence: number;
  knowledgeCoverage: number;
  memoryHealth: number;
  learningVelocity: number;
  activeGoals: number;
  capabilityStatus: Record<
    EnterpriseAiCognitiveCoreCapability,
    'operational'
  >;
}