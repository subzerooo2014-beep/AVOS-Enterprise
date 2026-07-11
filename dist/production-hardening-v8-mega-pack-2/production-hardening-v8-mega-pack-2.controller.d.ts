import { CreateDependencyDto } from "./dto/create-dependency.dto";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { CreateManagedServiceDto } from "./dto/create-managed-service.dto";
import { CreateRecoveryPlanDto } from "./dto/create-recovery-plan.dto";
import { UpdateServiceMetricsDto } from "./dto/update-service-metrics.dto";
import { ProductionHardeningV8MegaPack2Service } from "./production-hardening-v8-mega-pack-2.service";
export declare class ProductionHardeningV8MegaPack2Controller {
    private readonly service;
    constructor(service: ProductionHardeningV8MegaPack2Service);
    status(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        managedServices: number;
        healthyServices: number;
        degradedServices: number;
        criticalServices: number;
        dependencies: number;
        availableDependencies: number;
        degradedDependencies: number;
        unavailableDependencies: number;
        dependencyGraphEdges: number;
        incidents: number;
        resolvedIncidents: number;
        failedIncidents: number;
        rootCauseAnalyses: number;
        recoveryPlans: number;
        activeRecoveryPlans: number;
        recoveryExecutions: number;
        completedRecoveries: number;
        failedRecoveries: number;
        operationsDecisions: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v8-mega-pack-2.types").V8MegaPack2Snapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            operationsOrchestratorReady: boolean;
            dependencyIntelligenceReady: boolean;
            rootCauseAnalysisReady: boolean;
            autonomousRecoveryReady: boolean;
            incidentResolutionReady: boolean;
            operationsDecisionReady: boolean;
            noCriticalServices: boolean;
            noUnavailableDependencies: boolean;
            noFailedIncidents: boolean;
            noFailedRecoveries: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v8-mega-pack-2.types").V8MegaPack2Snapshot;
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
        entries: import("./production-hardening-v8-mega-pack-2.types").OperationsEvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v8-mega-pack-2.types").OperationsPlatformEvent[];
    };
    createService(dto: CreateManagedServiceDto): {
        success: boolean;
        service: import("./production-hardening-v8-mega-pack-2.types").ManagedService;
    };
    listServices(): {
        success: boolean;
        services: import("./production-hardening-v8-mega-pack-2.types").ManagedService[];
    };
    getService(serviceId: string): {
        success: boolean;
        service: import("./production-hardening-v8-mega-pack-2.types").ManagedService;
    };
    updateMetrics(serviceId: string, dto: UpdateServiceMetricsDto): {
        success: boolean;
        service: import("./production-hardening-v8-mega-pack-2.types").ManagedService;
    };
    createDependency(serviceId: string, dto: CreateDependencyDto): {
        success: boolean;
        dependency: import("./production-hardening-v8-mega-pack-2.types").ServiceDependency;
    };
    listDependencies(serviceId?: string): {
        success: boolean;
        dependencies: import("./production-hardening-v8-mega-pack-2.types").ServiceDependency[];
    };
    dependencyGraph(): {
        success: boolean;
        edges: import("./production-hardening-v8-mega-pack-2.types").DependencyGraphEdge[];
    };
    createRecoveryPlan(serviceId: string, dto: CreateRecoveryPlanDto): {
        success: boolean;
        plan: import("./production-hardening-v8-mega-pack-2.types").RecoveryPlan;
    };
    listRecoveryPlans(): {
        success: boolean;
        plans: import("./production-hardening-v8-mega-pack-2.types").RecoveryPlan[];
    };
    createIncident(serviceId: string, dto: CreateIncidentDto): {
        success: boolean;
        incident: import("./production-hardening-v8-mega-pack-2.types").OperationsIncident;
    };
    listIncidents(): {
        success: boolean;
        incidents: import("./production-hardening-v8-mega-pack-2.types").OperationsIncident[];
    };
    getIncident(incidentId: string): {
        success: boolean;
        incident: import("./production-hardening-v8-mega-pack-2.types").OperationsIncident;
    };
    analyzeIncident(incidentId: string): {
        success: boolean;
        analysis: import("./production-hardening-v8-mega-pack-2.types").RootCauseAnalysis;
    };
    listRootCauseAnalyses(): {
        success: boolean;
        analyses: import("./production-hardening-v8-mega-pack-2.types").RootCauseAnalysis[];
    };
    executeRecoveryPlan(incidentId: string, recoveryPlanId: string): {
        success: boolean;
        executions: import("./production-hardening-v8-mega-pack-2.types").RecoveryExecution[];
    };
    listRecoveryExecutions(): {
        success: boolean;
        executions: import("./production-hardening-v8-mega-pack-2.types").RecoveryExecution[];
    };
    listDecisions(): {
        success: boolean;
        decisions: import("./production-hardening-v8-mega-pack-2.types").OperationsDecision[];
    };
}
