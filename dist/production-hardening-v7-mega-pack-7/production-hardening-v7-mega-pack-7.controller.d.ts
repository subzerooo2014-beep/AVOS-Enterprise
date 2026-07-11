import { CompleteChaosDrillDto, CreateChaosDrillDto, CreateContinuityPlanDto, CreateResilienceIncidentDto, CreateSloDto, EvaluateReleaseDto, RecordSloSignalDto, ResolveResilienceIncidentDto, TestContinuityPlanDto } from "./production-hardening-v7-mega-pack-7.dto";
import { ProductionHardeningV7MegaPack7Service } from "./production-hardening-v7-mega-pack-7.service";
export declare class ProductionHardeningV7MegaPack7Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack7Service);
    getStatus(): import("./production-hardening-v7-mega-pack-7.types").ResilienceStatusResponse;
    getSnapshot(): import("./production-hardening-v7-mega-pack-7.types").ResilienceState & {
        evidenceVerification: {
            verified: boolean;
            checked: number;
            brokenAt: string | null;
        };
    };
    verifyEvidenceChain(): {
        success: true;
        verified: boolean;
        checked: number;
        brokenAt: string | null;
    };
    listSlos(): (import("./production-hardening-v7-mega-pack-7.types").ServiceLevelObjective & {
        latestBudget: import("./production-hardening-v7-mega-pack-7.types").ErrorBudgetSnapshot | null;
    })[];
    createSlo(dto: CreateSloDto): Promise<import("./production-hardening-v7-mega-pack-7.types").ServiceLevelObjective>;
    recordSignal(sloId: string, dto: RecordSloSignalDto): Promise<{
        signal: import("./production-hardening-v7-mega-pack-7.types").SloSignal;
        errorBudget: import("./production-hardening-v7-mega-pack-7.types").ErrorBudgetSnapshot;
    }>;
    listIncidents(): import("./production-hardening-v7-mega-pack-7.types").ResilienceIncident[];
    createIncident(dto: CreateResilienceIncidentDto): Promise<import("./production-hardening-v7-mega-pack-7.types").ResilienceIncident>;
    resolveIncident(incidentId: string, dto: ResolveResilienceIncidentDto): Promise<import("./production-hardening-v7-mega-pack-7.types").ResilienceIncident>;
    evaluateRelease(dto: EvaluateReleaseDto): Promise<{
        candidate: import("./production-hardening-v7-mega-pack-7.types").ReleaseCandidate;
        evaluation: import("./production-hardening-v7-mega-pack-7.types").ReleaseGateEvaluation;
    }>;
    listContinuityPlans(): import("./production-hardening-v7-mega-pack-7.types").ContinuityPlan[];
    createContinuityPlan(dto: CreateContinuityPlanDto): Promise<import("./production-hardening-v7-mega-pack-7.types").ContinuityPlan>;
    testContinuityPlan(planId: string, dto: TestContinuityPlanDto): Promise<import("./production-hardening-v7-mega-pack-7.types").ContinuityPlan>;
    listChaosDrills(): import("./production-hardening-v7-mega-pack-7.types").ChaosDrill[];
    createChaosDrill(dto: CreateChaosDrillDto): Promise<import("./production-hardening-v7-mega-pack-7.types").ChaosDrill>;
    startChaosDrill(drillId: string): Promise<import("./production-hardening-v7-mega-pack-7.types").ChaosDrill>;
    completeChaosDrill(drillId: string, dto: CompleteChaosDrillDto): Promise<import("./production-hardening-v7-mega-pack-7.types").ChaosDrill>;
}
