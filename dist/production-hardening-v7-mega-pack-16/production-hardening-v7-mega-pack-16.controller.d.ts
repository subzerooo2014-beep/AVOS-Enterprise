import { CreateClosureDto } from "./dto/create-closure.dto";
import { CreateConsistencyCheckDto } from "./dto/create-consistency-check.dto";
import { CreateTransitionPackageDto } from "./dto/create-transition-package.dto";
import { RegisterMegaPackValidationDto } from "./dto/register-mega-pack-validation.dto";
import { ProductionHardeningV7MegaPack16Service } from "./production-hardening-v7-mega-pack-16.service";
export declare class ProductionHardeningV7MegaPack16Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack16Service);
    status(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        closureRecords: number;
        completedClosures: number;
        failedClosures: number;
        megaPackValidations: number;
        passedMegaPackValidations: number;
        failedMegaPackValidations: number;
        consistencyChecks: number;
        passedConsistencyChecks: number;
        failedConsistencyChecks: number;
        immutableBaselines: number;
        sealedBaselines: number;
        verifiedBaselines: number;
        completionCertificates: number;
        verifiedCertificates: number;
        executiveReports: number;
        transitionPackages: number;
        readyTransitionPackages: number;
        acceptedTransitionPackages: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
        v7Status: string;
        enterpriseReady: boolean;
        productionCertified: boolean;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v7-mega-pack-16.types").V7ClosureSnapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        v7Status: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        enterpriseReady: boolean;
        productionCertified: boolean;
        checks: {
            allMegaPacksValidated: boolean;
            noFailedMegaPacks: boolean;
            crossPackConsistencyReady: boolean;
            noFailedConsistencyChecks: boolean;
            immutableBaselineReady: boolean;
            completionCertificateReady: boolean;
            executiveCompletionReady: boolean;
            transitionPackageReady: boolean;
            finalClosureCompleted: boolean;
            finalScoreReady: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v7-mega-pack-16.types").V7ClosureSnapshot;
        closure: import("./production-hardening-v7-mega-pack-16.types").V7ClosureRecord | undefined;
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
        entries: import("./production-hardening-v7-mega-pack-16.types").ClosureEvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v7-mega-pack-16.types").ClosurePlatformEvent[];
    };
    createClosure(dto: CreateClosureDto): {
        success: boolean;
        closure: import("./production-hardening-v7-mega-pack-16.types").V7ClosureRecord;
    };
    listClosures(): {
        success: boolean;
        closures: import("./production-hardening-v7-mega-pack-16.types").V7ClosureRecord[];
    };
    getClosure(closureId: string): {
        success: boolean;
        closure: import("./production-hardening-v7-mega-pack-16.types").V7ClosureRecord;
    };
    registerMegaPackValidation(closureId: string, dto: RegisterMegaPackValidationDto): {
        success: boolean;
        validation: import("./production-hardening-v7-mega-pack-16.types").MegaPackValidation;
    };
    listMegaPackValidations(closureId?: string): {
        success: boolean;
        validations: import("./production-hardening-v7-mega-pack-16.types").MegaPackValidation[];
    };
    createConsistencyCheck(closureId: string, dto: CreateConsistencyCheckDto): {
        success: boolean;
        check: import("./production-hardening-v7-mega-pack-16.types").CrossPackConsistencyCheck;
    };
    listConsistencyChecks(closureId?: string): {
        success: boolean;
        checks: import("./production-hardening-v7-mega-pack-16.types").CrossPackConsistencyCheck[];
    };
    createBaseline(closureId: string): {
        success: boolean;
        baseline: import("./production-hardening-v7-mega-pack-16.types").V7ImmutableBaseline;
    };
    sealBaseline(baselineId: string): {
        success: boolean;
        baseline: import("./production-hardening-v7-mega-pack-16.types").V7ImmutableBaseline;
    };
    verifyBaseline(baselineId: string): {
        success: boolean;
        baseline: import("./production-hardening-v7-mega-pack-16.types").V7ImmutableBaseline;
    };
    listBaselines(): {
        success: boolean;
        baselines: import("./production-hardening-v7-mega-pack-16.types").V7ImmutableBaseline[];
    };
    generateExecutiveReport(closureId: string): {
        success: boolean;
        report: import("./production-hardening-v7-mega-pack-16.types").ExecutiveCompletionReport;
    };
    listExecutiveReports(): {
        success: boolean;
        reports: import("./production-hardening-v7-mega-pack-16.types").ExecutiveCompletionReport[];
    };
    issueCertificate(closureId: string): {
        success: boolean;
        certificate: import("./production-hardening-v7-mega-pack-16.types").V7CompletionCertificate;
    };
    listCertificates(): {
        success: boolean;
        certificates: import("./production-hardening-v7-mega-pack-16.types").V7CompletionCertificate[];
    };
    createTransitionPackage(closureId: string, dto: CreateTransitionPackageDto): {
        success: boolean;
        transitionPackage: import("./production-hardening-v7-mega-pack-16.types").V8TransitionPackage;
    };
    acceptTransitionPackage(transitionPackageId: string): {
        success: boolean;
        transitionPackage: import("./production-hardening-v7-mega-pack-16.types").V8TransitionPackage;
    };
    listTransitionPackages(): {
        success: boolean;
        transitionPackages: import("./production-hardening-v7-mega-pack-16.types").V8TransitionPackage[];
    };
    completeClosure(closureId: string): {
        success: boolean;
        closure: import("./production-hardening-v7-mega-pack-16.types").V7ClosureRecord;
    };
}
