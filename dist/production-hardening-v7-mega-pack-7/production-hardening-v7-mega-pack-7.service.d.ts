import { OnModuleInit } from "@nestjs/common";
import { CompleteChaosDrillDto, CreateChaosDrillDto, CreateContinuityPlanDto, CreateResilienceIncidentDto, CreateSloDto, EvaluateReleaseDto, RecordSloSignalDto, ResolveResilienceIncidentDto, TestContinuityPlanDto } from "./production-hardening-v7-mega-pack-7.dto";
import { ProductionHardeningV7MegaPack7Store } from "./production-hardening-v7-mega-pack-7.store";
import { ChaosDrill, ContinuityPlan, ErrorBudgetSnapshot, ReleaseCandidate, ReleaseGateEvaluation, ResilienceIncident, ResilienceState, ResilienceStatusResponse, ServiceLevelObjective, SloSignal } from "./production-hardening-v7-mega-pack-7.types";
export declare class ProductionHardeningV7MegaPack7Service implements OnModuleInit {
    private readonly store;
    constructor(store: ProductionHardeningV7MegaPack7Store);
    onModuleInit(): Promise<void>;
    getStatus(): ResilienceStatusResponse;
    getSnapshot(): ResilienceState & {
        evidenceVerification: {
            verified: boolean;
            checked: number;
            brokenAt: string | null;
        };
    };
    listSlos(): Array<ServiceLevelObjective & {
        latestBudget: ErrorBudgetSnapshot | null;
    }>;
    createSlo(dto: CreateSloDto): Promise<ServiceLevelObjective>;
    recordSignal(sloId: string, dto: RecordSloSignalDto): Promise<{
        signal: SloSignal;
        errorBudget: ErrorBudgetSnapshot;
    }>;
    listIncidents(): ResilienceIncident[];
    createIncident(dto: CreateResilienceIncidentDto): Promise<ResilienceIncident>;
    resolveIncident(incidentId: string, dto: ResolveResilienceIncidentDto): Promise<ResilienceIncident>;
    evaluateRelease(dto: EvaluateReleaseDto): Promise<{
        candidate: ReleaseCandidate;
        evaluation: ReleaseGateEvaluation;
    }>;
    listContinuityPlans(): ContinuityPlan[];
    createContinuityPlan(dto: CreateContinuityPlanDto): Promise<ContinuityPlan>;
    testContinuityPlan(planId: string, dto: TestContinuityPlanDto): Promise<ContinuityPlan>;
    listChaosDrills(): ChaosDrill[];
    createChaosDrill(dto: CreateChaosDrillDto): Promise<ChaosDrill>;
    startChaosDrill(drillId: string): Promise<ChaosDrill>;
    completeChaosDrill(drillId: string, dto: CompleteChaosDrillDto): Promise<ChaosDrill>;
    verifyEvidenceChain(): {
        success: true;
        verified: boolean;
        checked: number;
        brokenAt: string | null;
    };
    private recalculateBudget;
    private getLatestBudgetBySlo;
    private calculateHealth;
    private bootstrapDefaults;
    private recordDomainActivity;
    private uniqueStrings;
    private round;
}
