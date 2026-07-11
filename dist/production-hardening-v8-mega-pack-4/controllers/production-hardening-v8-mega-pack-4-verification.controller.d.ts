import { ProductionHardeningV8MegaPack4VerificationService } from "../verification/production-hardening-v8-mega-pack-4-verification.service";
export declare class ProductionHardeningV8MegaPack4VerificationController {
    private readonly verification;
    constructor(verification: ProductionHardeningV8MegaPack4VerificationService);
    run(): Promise<{
        success: boolean;
        system: string;
        version: string;
        healthStatus: string;
        evidenceChainVerified: boolean;
        executionEvidenceVerified: boolean;
        controlMode: import("..").GovernanceControlMode;
        changeWindows: number;
        dependencyNodes: number;
        dependencyEdges: number;
        sloDefinitions: number;
        sloEvaluations: number;
        capacityPolicies: number;
        capacityEvaluations: number;
        approvalMatrixRules: number;
        runbooks: number;
        activeRunbooks: number;
        runbookExecutions: number;
        checkpoints: number;
        verifiedCheckpoints: number;
        retentionPolicies: number;
        archives: number;
        verifiedArchives: number;
        auditEntries: number;
        verificationChecksPassed: number;
        verificationChecksFailed: number;
        checks: {
            name: string;
            passed: boolean;
            details?: unknown;
        }[];
        verifiedAt: string;
    }>;
}
