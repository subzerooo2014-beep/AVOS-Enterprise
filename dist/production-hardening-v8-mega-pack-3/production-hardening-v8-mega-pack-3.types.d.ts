export type AiAgentStatus = "draft" | "active" | "paused" | "degraded" | "quarantined" | "retired";
export type AiAgentHealth = "healthy" | "degraded" | "critical" | "offline";
export type AiCapabilityCategory = "reasoning" | "planning" | "analysis" | "automation" | "retrieval" | "generation" | "security" | "governance" | "operations" | "communication";
export type AiTaskStatus = "queued" | "assigned" | "running" | "completed" | "failed" | "cancelled" | "blocked";
export type AiTaskPriority = "low" | "normal" | "high" | "critical";
export type AiExecutionDecision = "allow" | "deny" | "require_approval" | "quarantine" | "reroute";
export type AiCollaborationStatus = "proposed" | "active" | "completed" | "failed" | "cancelled";
export type PromptTemplateStatus = "draft" | "active" | "deprecated" | "blocked";
export type PromptRiskLevel = "low" | "medium" | "high" | "critical";
export interface AiAgent {
    id: string;
    name: string;
    code: string;
    description: string;
    status: AiAgentStatus;
    health: AiAgentHealth;
    version: string;
    environment: string;
    owner: string;
    modelProvider: string;
    modelName: string;
    capabilityIds: string[];
    maximumConcurrentTasks: number;
    activeTasks: number;
    successRatePercent: number;
    averageLatencyMs: number;
    totalExecutions: number;
    failedExecutions: number;
    lastHeartbeatAt: string;
    createdAt: string;
    updatedAt: string;
}
export interface AiCapability {
    id: string;
    name: string;
    code: string;
    description: string;
    category: AiCapabilityCategory;
    active: boolean;
    requiresApproval: boolean;
    riskLevel: PromptRiskLevel;
    maximumExecutionSeconds: number;
    allowedEnvironments: string[];
    createdAt: string;
    updatedAt: string;
}
export interface AiAgentCapabilityBinding {
    id: string;
    agentId: string;
    capabilityId: string;
    enabled: boolean;
    priorityWeight: number;
    maximumConcurrentExecutions: number;
    createdAt: string;
}
export interface AiTask {
    id: string;
    title: string;
    description: string;
    taskType: string;
    status: AiTaskStatus;
    priority: AiTaskPriority;
    requiredCapabilityCodes: string[];
    assignedAgentId?: string;
    parentTaskId?: string;
    correlationId: string;
    input: Record<string, unknown>;
    output?: Record<string, unknown>;
    errorMessage?: string;
    confidencePercent?: number;
    requestedBy: string;
    queuedAt: string;
    assignedAt?: string;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
}
export interface AiTaskExecution {
    id: string;
    taskId: string;
    agentId: string;
    status: "started" | "completed" | "failed" | "blocked";
    inputHash: string;
    outputHash?: string;
    executionTimeMs: number;
    confidencePercent: number;
    policyDecisionId?: string;
    startedAt: string;
    completedAt?: string;
    errorMessage?: string;
}
export interface AiCollaborationSession {
    id: string;
    name: string;
    objective: string;
    status: AiCollaborationStatus;
    coordinatorAgentId: string;
    participantAgentIds: string[];
    taskIds: string[];
    sharedContext: Record<string, unknown>;
    finalDecision?: string;
    confidencePercent?: number;
    createdAt: string;
    completedAt?: string;
}
export interface AiCollaborationMessage {
    id: string;
    sessionId: string;
    fromAgentId: string;
    toAgentId?: string;
    messageType: "proposal" | "analysis" | "challenge" | "response" | "decision" | "evidence";
    content: string;
    metadata: Record<string, unknown>;
    createdAt: string;
}
export interface AiControlPolicy {
    id: string;
    name: string;
    description: string;
    active: boolean;
    environment: string;
    protectedAgentCodes: string[];
    blockedCapabilityCodes: string[];
    approvalRequiredCapabilityCodes: string[];
    minimumConfidencePercent: number;
    maximumConcurrentTasksPerAgent: number;
    maximumExecutionSeconds: number;
    allowCrossAgentDelegation: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface AiPolicyEvaluation {
    id: string;
    policyId: string;
    agentId: string;
    taskId?: string;
    capabilityCodes: string[];
    decision: AiExecutionDecision;
    confidencePercent: number;
    violations: string[];
    evaluatedAt: string;
}
export interface PromptTemplate {
    id: string;
    name: string;
    code: string;
    version: number;
    description: string;
    status: PromptTemplateStatus;
    systemPrompt: string;
    userPromptTemplate: string;
    riskLevel: PromptRiskLevel;
    allowedAgentCodes: string[];
    requiredVariables: string[];
    checksum: string;
    createdBy: string;
    approvedBy?: string;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
}
export interface PromptExecutionRecord {
    id: string;
    promptTemplateId: string;
    agentId: string;
    taskId?: string;
    renderedPromptHash: string;
    outputHash?: string;
    status: "rendered" | "executed" | "blocked" | "failed";
    riskLevel: PromptRiskLevel;
    executedAt: string;
}
export interface AiResourceAllocation {
    id: string;
    agentId: string;
    taskId?: string;
    cpuUnits: number;
    memoryMb: number;
    tokenBudget: number;
    executionTimeoutSeconds: number;
    priorityWeight: number;
    allocatedAt: string;
    releasedAt?: string;
}
export interface AiSafetyDecision {
    id: string;
    agentId: string;
    taskId?: string;
    decision: "safe" | "restricted" | "blocked" | "human_review";
    riskScore: number;
    reasons: string[];
    decidedAt: string;
}
export interface AiControlPlaneEvidenceEntry {
    id: string;
    sequence: number;
    eventType: string;
    entityType: string;
    entityId: string;
    actor: string;
    timestamp: string;
    payload: Record<string, unknown>;
    previousHash: string;
    hash: string;
}
export interface AiControlPlanePlatformEvent {
    id: string;
    eventType: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    payload: Record<string, unknown>;
}
export interface V8MegaPack3Snapshot {
    generatedAt: string;
    healthStatus: "healthy" | "degraded" | "critical";
    evidenceChainVerified: boolean;
    agents: number;
    activeAgents: number;
    healthyAgents: number;
    degradedAgents: number;
    quarantinedAgents: number;
    capabilities: number;
    activeCapabilities: number;
    capabilityBindings: number;
    tasks: number;
    queuedTasks: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
    blockedTasks: number;
    taskExecutions: number;
    completedTaskExecutions: number;
    failedTaskExecutions: number;
    collaborationSessions: number;
    activeCollaborationSessions: number;
    completedCollaborationSessions: number;
    collaborationMessages: number;
    controlPolicies: number;
    activeControlPolicies: number;
    policyEvaluations: number;
    deniedPolicyEvaluations: number;
    approvalRequiredEvaluations: number;
    promptTemplates: number;
    activePromptTemplates: number;
    promptExecutions: number;
    blockedPromptExecutions: number;
    resourceAllocations: number;
    activeResourceAllocations: number;
    safetyDecisions: number;
    blockedSafetyDecisions: number;
    humanReviewSafetyDecisions: number;
    evidenceEntries: number;
    platformEvents: number;
}
