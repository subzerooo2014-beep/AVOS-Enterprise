export type RuntimeNodeStatus = "healthy" | "degraded" | "critical" | "offline" | "recovering";
export type RuntimeAdaptationStatus = "proposed" | "approved" | "executing" | "completed" | "failed" | "rolled_back";
export type PredictionSeverity = "low" | "medium" | "high" | "critical";
export type PredictionStatus = "detected" | "confirmed" | "mitigated" | "dismissed";
export type DigitalTwinStatus = "draft" | "synchronized" | "degraded" | "out_of_sync";
export type AutonomousDecision = "monitor" | "scale_up" | "scale_down" | "throttle" | "reroute" | "restart_service" | "activate_recovery" | "block_change" | "no_action";
export interface RuntimeNode {
    id: string;
    nodeName: string;
    serviceName: string;
    environment: string;
    region: string;
    status: RuntimeNodeStatus;
    cpuPercent: number;
    memoryPercent: number;
    latencyMs: number;
    errorRatePercent: number;
    requestRate: number;
    activeConnections: number;
    capacityUnits: number;
    healthScore: number;
    lastHeartbeatAt: string;
    createdAt: string;
    updatedAt: string;
}
export interface RuntimeMetricSample {
    id: string;
    nodeId: string;
    serviceName: string;
    cpuPercent: number;
    memoryPercent: number;
    latencyMs: number;
    errorRatePercent: number;
    requestRate: number;
    activeConnections: number;
    queueDepth: number;
    healthScore: number;
    recordedAt: string;
}
export interface AdaptiveRuntimePolicy {
    id: string;
    name: string;
    serviceName: string;
    environment: string;
    active: boolean;
    minimumHealthScore: number;
    maximumCpuPercent: number;
    maximumMemoryPercent: number;
    maximumLatencyMs: number;
    maximumErrorRatePercent: number;
    scaleUpThresholdPercent: number;
    scaleDownThresholdPercent: number;
    minimumCapacityUnits: number;
    maximumCapacityUnits: number;
    automaticExecution: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface RuntimeAdaptation {
    id: string;
    nodeId: string;
    policyId: string;
    decision: AutonomousDecision;
    status: RuntimeAdaptationStatus;
    reason: string;
    previousCapacityUnits: number;
    targetCapacityUnits: number;
    previousStatus: RuntimeNodeStatus;
    resultingStatus?: RuntimeNodeStatus;
    requestedBy: string;
    createdAt: string;
    approvedAt?: string;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
    failureReason?: string;
}
export interface OperationalPrediction {
    id: string;
    nodeId: string;
    serviceName: string;
    predictionType: "capacity_exhaustion" | "latency_degradation" | "error_spike" | "memory_pressure" | "cpu_saturation" | "service_failure";
    severity: PredictionSeverity;
    status: PredictionStatus;
    probabilityPercent: number;
    forecastWindowMinutes: number;
    predictedValue: number;
    thresholdValue: number;
    recommendedDecision: AutonomousDecision;
    explanation: string;
    detectedAt: string;
    confirmedAt?: string;
    mitigatedAt?: string;
}
export interface DigitalTwin {
    id: string;
    name: string;
    serviceName: string;
    environment: string;
    status: DigitalTwinStatus;
    runtimeNodeIds: string[];
    simulatedCapacityUnits: number;
    simulatedHealthScore: number;
    simulatedLatencyMs: number;
    simulatedErrorRatePercent: number;
    sourceStateHash: string;
    twinStateHash: string;
    createdAt: string;
    synchronizedAt?: string;
    updatedAt: string;
}
export interface DigitalTwinScenario {
    id: string;
    digitalTwinId: string;
    name: string;
    scenarioType: "traffic_spike" | "node_failure" | "region_failure" | "capacity_reduction" | "latency_increase" | "error_increase";
    input: Record<string, number>;
    result: {
        projectedHealthScore: number;
        projectedLatencyMs: number;
        projectedErrorRatePercent: number;
        projectedCapacityUnits: number;
        recommendedDecision: AutonomousDecision;
        resilient: boolean;
    };
    executedAt: string;
}
export interface AutonomousGovernanceRule {
    id: string;
    name: string;
    environment: string;
    active: boolean;
    protectedServices: string[];
    blockedDecisions: AutonomousDecision[];
    approvalRequiredDecisions: AutonomousDecision[];
    minimumConfidencePercent: number;
    minimumHealthScore: number;
    createdAt: string;
}
export interface AutonomousGovernanceEvaluation {
    id: string;
    ruleId: string;
    nodeId: string;
    requestedDecision: AutonomousDecision;
    decision: "allow" | "deny" | "require_approval";
    confidencePercent: number;
    violations: string[];
    evaluatedAt: string;
}
export interface V8EvidenceEntry {
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
export interface V8PlatformEvent {
    id: string;
    eventType: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    payload: Record<string, unknown>;
}
export interface V8MegaPack1Snapshot {
    generatedAt: string;
    healthStatus: "healthy" | "degraded" | "critical";
    evidenceChainVerified: boolean;
    runtimeNodes: number;
    healthyRuntimeNodes: number;
    degradedRuntimeNodes: number;
    criticalRuntimeNodes: number;
    metricSamples: number;
    adaptivePolicies: number;
    activeAdaptivePolicies: number;
    runtimeAdaptations: number;
    completedAdaptations: number;
    failedAdaptations: number;
    predictions: number;
    highRiskPredictions: number;
    criticalPredictions: number;
    mitigatedPredictions: number;
    digitalTwins: number;
    synchronizedDigitalTwins: number;
    digitalTwinScenarios: number;
    resilientScenarios: number;
    governanceRules: number;
    activeGovernanceRules: number;
    governanceEvaluations: number;
    deniedGovernanceEvaluations: number;
    evidenceEntries: number;
    platformEvents: number;
}
