import { ConsolidateEvidenceDto } from "./dto/consolidate-evidence.dto";
import { CreateCertificationDto } from "./dto/create-certification.dto";
import { CreateExecutiveSignOffDto } from "./dto/create-executive-sign-off.dto";
import { CreateOperationalAcceptanceDto } from "./dto/create-operational-acceptance.dto";
import { EvaluateCertificationDto } from "./dto/evaluate-certification.dto";
import { ProductionHardeningV7MegaPack15Service } from "./production-hardening-v7-mega-pack-15.service";
export declare class ProductionHardeningV7MegaPack15Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack15Service);
    status(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        certifications: number;
        certifiedCertifications: number;
        rejectedCertifications: number;
        readinessGates: number;
        passedReadinessGates: number;
        warningReadinessGates: number;
        failedReadinessGates: number;
        operationalAcceptances: number;
        approvedOperationalAcceptances: number;
        executiveSignOffs: number;
        approvedExecutiveSignOffs: number;
        evidenceConsolidations: number;
        verifiedEvidenceConsolidations: number;
        scorecards: number;
        certificateDocuments: number;
        validCertificateDocuments: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v7-mega-pack-15.types").ProductionCertificationSnapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            certificationReady: boolean;
            readinessGatesReady: boolean;
            operationalAcceptanceReady: boolean;
            executiveSignOffReady: boolean;
            evidenceConsolidationReady: boolean;
            scorecardReady: boolean;
            certificateDocumentReady: boolean;
            noFailedGates: boolean;
            noWarningGates: boolean;
            noRejectedCertifications: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v7-mega-pack-15.types").ProductionCertificationSnapshot;
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
        entries: import("./production-hardening-v7-mega-pack-15.types").CertificationEvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v7-mega-pack-15.types").CertificationPlatformEvent[];
    };
    createCertification(dto: CreateCertificationDto): {
        success: boolean;
        certification: import("./production-hardening-v7-mega-pack-15.types").ProductionCertification;
    };
    listCertifications(): {
        success: boolean;
        certifications: import("./production-hardening-v7-mega-pack-15.types").ProductionCertification[];
    };
    getCertification(certificationId: string): {
        success: boolean;
        certification: import("./production-hardening-v7-mega-pack-15.types").ProductionCertification;
    };
    evaluateCertification(certificationId: string, dto: EvaluateCertificationDto): {
        success: boolean;
        scorecard: import("./production-hardening-v7-mega-pack-15.types").ProductionScorecard;
    };
    listGates(certificationId?: string): {
        success: boolean;
        gates: import("./production-hardening-v7-mega-pack-15.types").ProductionReadinessGate[];
    };
    listScorecards(): {
        success: boolean;
        scorecards: import("./production-hardening-v7-mega-pack-15.types").ProductionScorecard[];
    };
    createOperationalAcceptance(certificationId: string, dto: CreateOperationalAcceptanceDto): {
        success: boolean;
        acceptance: import("./production-hardening-v7-mega-pack-15.types").OperationalAcceptance;
    };
    approveOperationalAcceptance(acceptanceId: string): {
        success: boolean;
        acceptance: import("./production-hardening-v7-mega-pack-15.types").OperationalAcceptance;
    };
    listOperationalAcceptances(): {
        success: boolean;
        acceptances: import("./production-hardening-v7-mega-pack-15.types").OperationalAcceptance[];
    };
    createExecutiveSignOff(certificationId: string, dto: CreateExecutiveSignOffDto): {
        success: boolean;
        signOff: import("./production-hardening-v7-mega-pack-15.types").ExecutiveSignOff;
    };
    approveExecutiveSignOff(signOffId: string): {
        success: boolean;
        signOff: import("./production-hardening-v7-mega-pack-15.types").ExecutiveSignOff;
    };
    listExecutiveSignOffs(): {
        success: boolean;
        signOffs: import("./production-hardening-v7-mega-pack-15.types").ExecutiveSignOff[];
    };
    consolidateEvidence(certificationId: string, dto: ConsolidateEvidenceDto): {
        success: boolean;
        consolidation: import("./production-hardening-v7-mega-pack-15.types").EvidenceConsolidation;
    };
    listEvidenceConsolidations(): {
        success: boolean;
        consolidations: import("./production-hardening-v7-mega-pack-15.types").EvidenceConsolidation[];
    };
    certifyProduction(certificationId: string): {
        success: boolean;
        certification: import("./production-hardening-v7-mega-pack-15.types").ProductionCertification;
    };
    issueCertificateDocument(certificationId: string): {
        success: boolean;
        certificate: import("./production-hardening-v7-mega-pack-15.types").ProductionCertificateDocument;
    };
    listCertificateDocuments(): {
        success: boolean;
        certificates: import("./production-hardening-v7-mega-pack-15.types").ProductionCertificateDocument[];
    };
}
