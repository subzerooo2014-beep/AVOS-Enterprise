import { AddReleaseArtifactDto } from "./dto/add-release-artifact.dto";
import { ApproveReleaseDto } from "./dto/approve-release.dto";
import { CreateReleaseDto } from "./dto/create-release.dto";
import { CreateRollbackPlanDto } from "./dto/create-rollback-plan.dto";
import { DeployReleaseDto } from "./dto/deploy-release.dto";
import { EvaluateReleaseDto } from "./dto/evaluate-release.dto";
import { RejectReleaseDto } from "./dto/reject-release.dto";
import { ProductionHardeningV7MegaPack10Service } from "./production-hardening-v7-mega-pack-10.service";
export declare class ProductionHardeningV7MegaPack10Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack10Service);
    status(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        releases: number;
        approvedReleases: number;
        deployedReleases: number;
        rejectedReleases: number;
        rolledBackReleases: number;
        artifacts: number;
        verifiedArtifacts: number;
        releaseGates: number;
        passedGates: number;
        failedGates: number;
        rollbackPlans: number;
        validatedRollbackPlans: number;
        readinessAssessments: number;
        readyAssessments: number;
        deploymentExecutions: number;
        completedDeployments: number;
        failedDeployments: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v7-mega-pack-10.types").ReleaseGovernanceSnapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            releaseGovernanceReady: boolean;
            artifactIntegrityReady: boolean;
            releaseGatesReady: boolean;
            rollbackProtectionReady: boolean;
            readinessAssessmentReady: boolean;
            deploymentOrchestrationReady: boolean;
            noFailedDeployments: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v7-mega-pack-10.types").ReleaseGovernanceSnapshot;
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
        entries: import("./production-hardening-v7-mega-pack-10.types").ReleaseEvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v7-mega-pack-10.types").ReleasePlatformEvent[];
    };
    createRelease(dto: CreateReleaseDto): {
        success: boolean;
        release: import("./production-hardening-v7-mega-pack-10.types").ReleaseCandidate;
    };
    listReleases(): {
        success: boolean;
        releases: import("./production-hardening-v7-mega-pack-10.types").ReleaseCandidate[];
    };
    getRelease(releaseId: string): {
        success: boolean;
        release: import("./production-hardening-v7-mega-pack-10.types").ReleaseCandidate;
    };
    addArtifact(releaseId: string, dto: AddReleaseArtifactDto): {
        success: boolean;
        artifact: import("./production-hardening-v7-mega-pack-10.types").ReleaseArtifact;
    };
    verifyArtifact(artifactId: string): {
        success: boolean;
        artifact: import("./production-hardening-v7-mega-pack-10.types").ReleaseArtifact;
    };
    listArtifacts(releaseId?: string): {
        success: boolean;
        artifacts: import("./production-hardening-v7-mega-pack-10.types").ReleaseArtifact[];
    };
    createRollbackPlan(releaseId: string, dto: CreateRollbackPlanDto): {
        success: boolean;
        rollbackPlan: import("./production-hardening-v7-mega-pack-10.types").RollbackPlan;
    };
    validateRollbackPlan(planId: string): {
        success: boolean;
        rollbackPlan: import("./production-hardening-v7-mega-pack-10.types").RollbackPlan;
    };
    listRollbackPlans(releaseId?: string): {
        success: boolean;
        rollbackPlans: import("./production-hardening-v7-mega-pack-10.types").RollbackPlan[];
    };
    evaluateRelease(releaseId: string, dto: EvaluateReleaseDto): {
        success: boolean;
        assessment: import("./production-hardening-v7-mega-pack-10.types").ProductionReadinessAssessment;
    };
    approveRelease(releaseId: string, dto: ApproveReleaseDto): {
        success: boolean;
        release: import("./production-hardening-v7-mega-pack-10.types").ReleaseCandidate;
    };
    rejectRelease(releaseId: string, dto: RejectReleaseDto): {
        success: boolean;
        release: import("./production-hardening-v7-mega-pack-10.types").ReleaseCandidate;
    };
    deployRelease(releaseId: string, dto: DeployReleaseDto): {
        success: boolean;
        deployment: import("./production-hardening-v7-mega-pack-10.types").DeploymentExecution;
    };
    rollbackRelease(releaseId: string): {
        success: boolean;
        deployment: import("./production-hardening-v7-mega-pack-10.types").DeploymentExecution;
    };
    listGates(releaseId?: string): {
        success: boolean;
        gates: import("./production-hardening-v7-mega-pack-10.types").ReleaseGate[];
    };
    listAssessments(releaseId?: string): {
        success: boolean;
        assessments: import("./production-hardening-v7-mega-pack-10.types").ProductionReadinessAssessment[];
    };
    listDeployments(releaseId?: string): {
        success: boolean;
        deployments: import("./production-hardening-v7-mega-pack-10.types").DeploymentExecution[];
    };
}
