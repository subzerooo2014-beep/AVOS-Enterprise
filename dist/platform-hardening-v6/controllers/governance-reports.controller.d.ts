import { GenerateComplianceReportDto } from "../dto/generate-compliance-report.dto";
import { GenerateEvidencePackageDto } from "../dto/generate-evidence-package.dto";
import { GovernanceComplianceReportService } from "../services/governance-compliance-report.service";
import { GovernanceEvidenceVaultService } from "../services/governance-evidence-vault.service";
import { GovernanceRecordVerificationService } from "../services/governance-record-verification.service";
export declare class GovernanceReportsController {
    private readonly compliance;
    private readonly evidence;
    private readonly verification;
    constructor(compliance: GovernanceComplianceReportService, evidence: GovernanceEvidenceVaultService, verification: GovernanceRecordVerificationService);
    generateCompliance(dto: GenerateComplianceReportDto, request: any): Promise<{
        success: boolean;
        snapshot: any;
    }>;
    listCompliance(limit?: string): Promise<{
        success: boolean;
        snapshots: any;
    }>;
    latestCompliance(): Promise<{
        success: boolean;
        snapshot: any;
    }>;
    getCompliance(id: string): Promise<{
        success: boolean;
        snapshot: any;
    }>;
    verifyCompliance(id: string): Promise<{
        success: boolean;
        verification: import("..").SignedRecordVerification;
    }>;
    generateEvidence(dto: GenerateEvidencePackageDto, request: any): Promise<{
        success: boolean;
        package: any;
    }>;
    listEvidence(limit?: string): Promise<{
        success: boolean;
        packages: any;
    }>;
    latestEvidence(): Promise<{
        success: boolean;
        package: any;
    }>;
    getEvidence(id: string): Promise<{
        success: boolean;
        package: any;
    }>;
    verifyEvidence(id: string): Promise<{
        success: boolean;
        verification: import("..").SignedRecordVerification;
    }>;
}
