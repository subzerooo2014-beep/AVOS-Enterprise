import { CreateAdaptivePolicyDto } from "./dto/create-adaptive-policy.dto";
import { CreateDigitalTwinDto } from "./dto/create-digital-twin.dto";
import { CreateGovernanceRuleDto } from "./dto/create-governance-rule.dto";
import { CreatePredictionDto } from "./dto/create-prediction.dto";
import { CreateRuntimeNodeDto } from "./dto/create-runtime-node.dto";
import { ExecuteTwinScenarioDto } from "./dto/execute-twin-scenario.dto";
import { RecordRuntimeMetricsDto } from "./dto/record-runtime-metrics.dto";
import { ProductionHardeningV8MegaPack1Service } from "./production-hardening-v8-mega-pack-1.service";
import { AutonomousDecision } from "./production-hardening-v8-mega-pack-1.types";
export declare class ProductionHardeningV8MegaPack1Controller {
    private readonly service;
    constructor(service: ProductionHardeningV8MegaPack1Service);
    status(): {
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
        success: boolean;
        system: string;
        version: string;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v8-mega-pack-1.types").V8MegaPack1Snapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            runtimeFoundationReady: boolean;
            runtimeMetricsReady: boolean;
            adaptiveRuntimeReady: boolean;
            predictiveOperationsReady: boolean;
            digitalTwinReady: boolean;
            simulationReady: boolean;
            autonomousGovernanceReady: boolean;
            noCriticalRuntimeNodes: boolean;
            noFailedAdaptations: boolean;
            noDeniedGovernanceEvaluations: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v8-mega-pack-1.types").V8MegaPack1Snapshot;
    };
    verifyEvidence(): {
        verified: boolean;
        entries: number;
        brokenAtSequence: number;
        checkedAt: string;
        success: boolean;
    } | {
        verified: boolean;
        entries: number;
        checkedAt: string;
        brokenAtSequence?: undefined;
        success: boolean;
    };
    evidence(): {
        success: boolean;
        entries: import("./production-hardening-v8-mega-pack-1.types").V8EvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v8-mega-pack-1.types").V8PlatformEvent[];
    };
    createRuntimeNode(dto: CreateRuntimeNodeDto): {
        success: boolean;
        runtimeNode: import("./production-hardening-v8-mega-pack-1.types").RuntimeNode;
    };
    listRuntimeNodes(): {
        success: boolean;
        runtimeNodes: import("./production-hardening-v8-mega-pack-1.types").RuntimeNode[];
    };
    getRuntimeNode(nodeId: string): {
        success: boolean;
        runtimeNode: import("./production-hardening-v8-mega-pack-1.types").RuntimeNode;
    };
    recordRuntimeMetrics(nodeId: string, dto: RecordRuntimeMetricsDto): {
        success: boolean;
        metricSample: import("./production-hardening-v8-mega-pack-1.types").RuntimeMetricSample;
    };
    listMetricSamples(nodeId?: string): {
        success: boolean;
        metricSamples: import("./production-hardening-v8-mega-pack-1.types").RuntimeMetricSample[];
    };
    createAdaptivePolicy(dto: CreateAdaptivePolicyDto): {
        success: boolean;
        policy: import("./production-hardening-v8-mega-pack-1.types").AdaptiveRuntimePolicy;
    };
    listAdaptivePolicies(): {
        success: boolean;
        policies: import("./production-hardening-v8-mega-pack-1.types").AdaptiveRuntimePolicy[];
    };
    evaluateAdaptivePolicies(nodeId: string): {
        success: boolean;
        adaptations: import("./production-hardening-v8-mega-pack-1.types").RuntimeAdaptation[];
    };
    executeAdaptation(adaptationId: string): {
        success: boolean;
        adaptation: import("./production-hardening-v8-mega-pack-1.types").RuntimeAdaptation;
    };
    listAdaptations(): {
        success: boolean;
        adaptations: import("./production-hardening-v8-mega-pack-1.types").RuntimeAdaptation[];
    };
    createPrediction(nodeId: string, dto: CreatePredictionDto): {
        success: boolean;
        prediction: import("./production-hardening-v8-mega-pack-1.types").OperationalPrediction;
    };
    mitigatePrediction(predictionId: string): {
        success: boolean;
        prediction: import("./production-hardening-v8-mega-pack-1.types").OperationalPrediction;
    };
    listPredictions(): {
        success: boolean;
        predictions: import("./production-hardening-v8-mega-pack-1.types").OperationalPrediction[];
    };
    createDigitalTwin(dto: CreateDigitalTwinDto): {
        success: boolean;
        digitalTwin: import("./production-hardening-v8-mega-pack-1.types").DigitalTwin;
    };
    listDigitalTwins(): {
        success: boolean;
        digitalTwins: import("./production-hardening-v8-mega-pack-1.types").DigitalTwin[];
    };
    getDigitalTwin(digitalTwinId: string): {
        success: boolean;
        digitalTwin: import("./production-hardening-v8-mega-pack-1.types").DigitalTwin;
    };
    synchronizeDigitalTwin(digitalTwinId: string): {
        success: boolean;
        digitalTwin: import("./production-hardening-v8-mega-pack-1.types").DigitalTwin;
    };
    executeTwinScenario(digitalTwinId: string, dto: ExecuteTwinScenarioDto): {
        success: boolean;
        scenario: import("./production-hardening-v8-mega-pack-1.types").DigitalTwinScenario;
    };
    listDigitalTwinScenarios(): {
        success: boolean;
        scenarios: import("./production-hardening-v8-mega-pack-1.types").DigitalTwinScenario[];
    };
    createGovernanceRule(dto: CreateGovernanceRuleDto): {
        success: boolean;
        rule: import("./production-hardening-v8-mega-pack-1.types").AutonomousGovernanceRule;
    };
    listGovernanceRules(): {
        success: boolean;
        rules: import("./production-hardening-v8-mega-pack-1.types").AutonomousGovernanceRule[];
    };
    evaluateGovernance(nodeId: string, decision: AutonomousDecision, confidencePercent?: string): {
        success: boolean;
        evaluation: import("./production-hardening-v8-mega-pack-1.types").AutonomousGovernanceEvaluation;
    };
    listGovernanceEvaluations(): {
        success: boolean;
        evaluations: import("./production-hardening-v8-mega-pack-1.types").AutonomousGovernanceEvaluation[];
    };
}
