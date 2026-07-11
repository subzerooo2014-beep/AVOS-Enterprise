export type ReadinessGateCategory = "security" | "reliability" | "operations" | "compliance" | "data" | "recovery" | "deployment" | "runtime";
export type ReadinessGateStatus = "pending" | "passed" | "warning" | "failed";
export type CertificationStatus = "draft" | "evaluating" | "certified" | "rejected" | "expired" | "revoked";
export type SignOffStatus = "pending" | "approved" | "rejected";
export interface ProductionReadinessGate {
    id: string;
    name: string;
    category: ReadinessGateCategory;
    required: boolean;
    minimumScore: number;
    measuredScore: number;
    status: ReadinessGateStatus;
    message: string;
    evaluatedAt: string;
}
export interface ProductionCertification {
    id: string;
    name: string;
    version: string;
    environment: string;
    status: CertificationStatus;
    overallScore: number;
    minimumRequiredScore: number;
    gateIds: string[];
    blockerCount: number;
    warningCount: number;
    requestedBy: string;
    certifiedBy?: string;
    requestedAt: string;
    evaluatedAt?: string;
    certifiedAt?: string;
    expiresAt?: string;
}
export interface OperationalAcceptance {
    id: string;
    certificationId: string;
    operationsOwner: string;
    serviceOwner: string;
    supportModelValidated: boolean;
    monitoringValidated: boolean;
    incidentResponseValidated: boolean;
    backupRecoveryValidated: boolean;
    runbooksValidated: boolean;
    status: SignOffStatus;
    approvedBy?: string;
    createdAt: string;
    approvedAt?: string;
}
export interface ExecutiveSignOff {
    id: string;
    certificationId: string;
    executiveRole: string;
    executiveName: string;
    status: SignOffStatus;
    comments: string;
    createdAt: string;
    decidedAt?: string;
}
export interface EvidenceConsolidation {
    id: string;
    certificationId: string;
    sourceSystems: string[];
    evidencePackages: number;
    evidenceEntries: number;
    integrityVerified: boolean;
    consolidatedHash: string;
    createdAt: string;
}
export interface ProductionScorecard {
    id: string;
    certificationId: string;
    securityScore: number;
    reliabilityScore: number;
    operationsScore: number;
    complianceScore: number;
    dataScore: number;
    recoveryScore: number;
    deploymentScore: number;
    runtimeScore: number;
    globalScore: number;
    generatedAt: string;
}
export interface ProductionCertificateDocument {
    id: string;
    certificationId: string;
    certificateNumber: string;
    systemName: string;
    version: string;
    environment: string;
    certified: boolean;
    globalScore: number;
    issuedAt: string;
    expiresAt: string;
    integrityHash: string;
}
export interface CertificationEvidenceEntry {
    id: string;
    sequence: number;
    eventType: string;
    entityType: string;
    entityId: string;
    actor: string;
    timestamp: string;
    payload: Record<string, unknown>;
    previousHash: string;
    hash: string;
}
export interface CertificationPlatformEvent {
    id: string;
    eventType: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    payload: Record<string, unknown>;
}
export interface ProductionCertificationSnapshot {
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
}
