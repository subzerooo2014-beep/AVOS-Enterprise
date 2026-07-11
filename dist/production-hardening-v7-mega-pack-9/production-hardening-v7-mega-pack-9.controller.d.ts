import { CreateCheckpointDto } from "./dto/create-checkpoint.dto";
import { CreateContinuityExerciseDto } from "./dto/create-continuity-exercise.dto";
import { CreateFailureSimulationDto } from "./dto/create-failure-simulation.dto";
import { CreateRecoveryPlanDto } from "./dto/create-recovery-plan.dto";
import { CreateResilienceProfileDto } from "./dto/create-resilience-profile.dto";
import { ExecuteRecoveryPlanDto } from "./dto/execute-recovery-plan.dto";
import { RecordDependencyHealthDto } from "./dto/record-dependency-health.dto";
import { ProductionHardeningV7MegaPack9Service } from "./production-hardening-v7-mega-pack-9.service";
export declare class ProductionHardeningV7MegaPack9Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack9Service);
    getStatus(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        profiles: number;
        activeProfiles: number;
        recoveryPlans: number;
        activeRecoveryPlans: number;
        recoveryExecutions: number;
        completedRecoveries: number;
        failedRecoveries: number;
        continuityExercises: number;
        passedExercises: number;
        dependencyChecks: number;
        degradedDependencies: number;
        unavailableDependencies: number;
        checkpoints: number;
        verifiedCheckpoints: number;
        failureSimulations: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
    };
    getSnapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v7-mega-pack-9.types").ResilienceSnapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            profileControlPlaneReady: boolean;
            recoveryPlansReady: boolean;
            recoveryExecutionReady: boolean;
            continuityExerciseReady: boolean;
            dependencyMonitoringReady: boolean;
            checkpointProtectionReady: boolean;
            failureSimulationReady: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v7-mega-pack-9.types").ResilienceSnapshot;
    };
    verifyEvidenceChain(): {
        verified: boolean;
        entries: number;
        brokenAtSequence?: number;
        checkedAt: string;
        success: boolean;
    };
    listEvidence(): {
        success: boolean;
        entries: import("./production-hardening-v7-mega-pack-9.types").ResilienceEvidenceEntry[];
    };
    listEvents(): {
        success: boolean;
        events: import("./production-hardening-v7-mega-pack-9.types").ResiliencePlatformEvent[];
    };
    createProfile(dto: CreateResilienceProfileDto): {
        success: boolean;
        profile: import("./production-hardening-v7-mega-pack-9.types").ResilienceProfile;
    };
    listProfiles(): {
        success: boolean;
        profiles: import("./production-hardening-v7-mega-pack-9.types").ResilienceProfile[];
    };
    getProfile(profileId: string): {
        success: boolean;
        profile: import("./production-hardening-v7-mega-pack-9.types").ResilienceProfile;
    };
    activateProfile(profileId: string): {
        success: boolean;
        profile: import("./production-hardening-v7-mega-pack-9.types").ResilienceProfile;
    };
    createRecoveryPlan(dto: CreateRecoveryPlanDto): {
        success: boolean;
        recoveryPlan: import("./production-hardening-v7-mega-pack-9.types").RecoveryPlan;
    };
    listRecoveryPlans(profileId?: string): {
        success: boolean;
        recoveryPlans: import("./production-hardening-v7-mega-pack-9.types").RecoveryPlan[];
    };
    getRecoveryPlan(planId: string): {
        success: boolean;
        recoveryPlan: import("./production-hardening-v7-mega-pack-9.types").RecoveryPlan;
    };
    approveRecoveryPlan(planId: string): {
        success: boolean;
        recoveryPlan: import("./production-hardening-v7-mega-pack-9.types").RecoveryPlan;
    };
    executeRecoveryPlan(planId: string, dto: ExecuteRecoveryPlanDto): {
        success: boolean;
        execution: import("./production-hardening-v7-mega-pack-9.types").RecoveryExecution;
    };
    listRecoveryExecutions(planId?: string): {
        success: boolean;
        executions: import("./production-hardening-v7-mega-pack-9.types").RecoveryExecution[];
    };
    getRecoveryExecution(executionId: string): {
        success: boolean;
        execution: import("./production-hardening-v7-mega-pack-9.types").RecoveryExecution;
    };
    createContinuityExercise(dto: CreateContinuityExerciseDto): {
        success: boolean;
        exercise: import("./production-hardening-v7-mega-pack-9.types").ContinuityExercise;
    };
    listContinuityExercises(): {
        success: boolean;
        exercises: import("./production-hardening-v7-mega-pack-9.types").ContinuityExercise[];
    };
    runContinuityExercise(exerciseId: string): {
        success: boolean;
        exercise: import("./production-hardening-v7-mega-pack-9.types").ContinuityExercise;
    };
    recordDependencyHealth(dto: RecordDependencyHealthDto): {
        success: boolean;
        dependency: import("./production-hardening-v7-mega-pack-9.types").DependencyHealth;
    };
    listDependencyHealth(): {
        success: boolean;
        dependencies: import("./production-hardening-v7-mega-pack-9.types").DependencyHealth[];
    };
    createCheckpoint(dto: CreateCheckpointDto): {
        success: boolean;
        checkpoint: import("./production-hardening-v7-mega-pack-9.types").ServiceCheckpoint;
    };
    listCheckpoints(): {
        success: boolean;
        checkpoints: import("./production-hardening-v7-mega-pack-9.types").ServiceCheckpoint[];
    };
    verifyCheckpoint(checkpointId: string): {
        success: boolean;
        checkpoint: import("./production-hardening-v7-mega-pack-9.types").ServiceCheckpoint;
    };
    restoreCheckpoint(checkpointId: string): {
        success: boolean;
        checkpoint: import("./production-hardening-v7-mega-pack-9.types").ServiceCheckpoint;
    };
    createFailureSimulation(dto: CreateFailureSimulationDto): {
        success: boolean;
        simulation: import("./production-hardening-v7-mega-pack-9.types").FailureSimulation;
    };
    listFailureSimulations(): {
        success: boolean;
        simulations: import("./production-hardening-v7-mega-pack-9.types").FailureSimulation[];
    };
    runFailureSimulation(simulationId: string): {
        success: boolean;
        simulation: import("./production-hardening-v7-mega-pack-9.types").FailureSimulation;
    };
}
