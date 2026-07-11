import { CreateSloDto } from "./dto/create-slo.dto";
import { CreateTrafficPolicyDto } from "./dto/create-traffic-policy.dto";
import { ExecuteProtectionDto } from "./dto/execute-protection.dto";
import { GenerateCapacityForecastDto } from "./dto/generate-capacity-forecast.dto";
import { RecordMetricSampleDto } from "./dto/record-metric-sample.dto";
import { ProductionHardeningV7MegaPack12Service } from "./production-hardening-v7-mega-pack-12.service";
export declare class ProductionHardeningV7MegaPack12Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack12Service);
    status(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        serviceLevelObjectives: number;
        activeServiceLevelObjectives: number;
        breachedServiceLevelObjectives: number;
        metricSamples: number;
        sloEvaluations: number;
        passedEvaluations: number;
        failedEvaluations: number;
        errorBudgets: number;
        healthyErrorBudgets: number;
        exhaustedErrorBudgets: number;
        capacityForecasts: number;
        highRiskForecasts: number;
        criticalRiskForecasts: number;
        trafficPolicies: number;
        activeTrafficPolicies: number;
        triggeredTrafficPolicies: number;
        protectionExecutions: number;
        reliabilityDecisions: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v7-mega-pack-12.types").ReliabilitySnapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            sloGovernanceReady: boolean;
            metricCollectionReady: boolean;
            sloEvaluationReady: boolean;
            errorBudgetReady: boolean;
            capacityForecastReady: boolean;
            trafficProtectionReady: boolean;
            reliabilityDecisionReady: boolean;
            noBreachedSlos: boolean;
            noExhaustedBudgets: boolean;
            noCriticalCapacityRisk: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v7-mega-pack-12.types").ReliabilitySnapshot;
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
        entries: import("./production-hardening-v7-mega-pack-12.types").ReliabilityEvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v7-mega-pack-12.types").ReliabilityPlatformEvent[];
    };
    createSlo(dto: CreateSloDto): {
        success: boolean;
        slo: import("./production-hardening-v7-mega-pack-12.types").ServiceLevelObjective;
    };
    listSlos(): {
        success: boolean;
        slos: import("./production-hardening-v7-mega-pack-12.types").ServiceLevelObjective[];
    };
    getSlo(sloId: string): {
        success: boolean;
        slo: import("./production-hardening-v7-mega-pack-12.types").ServiceLevelObjective;
    };
    activateSlo(sloId: string): {
        success: boolean;
        slo: import("./production-hardening-v7-mega-pack-12.types").ServiceLevelObjective;
    };
    recordMetricSample(dto: RecordMetricSampleDto): {
        success: boolean;
        sample: import("./production-hardening-v7-mega-pack-12.types").ServiceMetricSample;
    };
    listMetricSamples(sloId?: string): {
        success: boolean;
        samples: import("./production-hardening-v7-mega-pack-12.types").ServiceMetricSample[];
    };
    evaluateSlo(sloId: string): {
        success: boolean;
        evaluation: import("./production-hardening-v7-mega-pack-12.types").SloEvaluation;
    };
    listEvaluations(sloId?: string): {
        success: boolean;
        evaluations: import("./production-hardening-v7-mega-pack-12.types").SloEvaluation[];
    };
    calculateErrorBudget(sloId: string): {
        success: boolean;
        errorBudget: import("./production-hardening-v7-mega-pack-12.types").ErrorBudget;
    };
    listErrorBudgets(): {
        success: boolean;
        errorBudgets: import("./production-hardening-v7-mega-pack-12.types").ErrorBudget[];
    };
    generateCapacityForecast(dto: GenerateCapacityForecastDto): {
        success: boolean;
        forecast: import("./production-hardening-v7-mega-pack-12.types").CapacityForecast;
    };
    listCapacityForecasts(): {
        success: boolean;
        forecasts: import("./production-hardening-v7-mega-pack-12.types").CapacityForecast[];
    };
    createTrafficPolicy(dto: CreateTrafficPolicyDto): {
        success: boolean;
        policy: import("./production-hardening-v7-mega-pack-12.types").TrafficProtectionPolicy;
    };
    listTrafficPolicies(): {
        success: boolean;
        policies: import("./production-hardening-v7-mega-pack-12.types").TrafficProtectionPolicy[];
    };
    activateTrafficPolicy(policyId: string): {
        success: boolean;
        policy: import("./production-hardening-v7-mega-pack-12.types").TrafficProtectionPolicy;
    };
    executeProtection(policyId: string, dto: ExecuteProtectionDto): {
        success: boolean;
        execution: import("./production-hardening-v7-mega-pack-12.types").TrafficProtectionExecution;
    };
    listProtectionExecutions(): {
        success: boolean;
        executions: import("./production-hardening-v7-mega-pack-12.types").TrafficProtectionExecution[];
    };
    listReliabilityDecisions(): {
        success: boolean;
        decisions: import("./production-hardening-v7-mega-pack-12.types").ReliabilityDecision[];
    };
}
