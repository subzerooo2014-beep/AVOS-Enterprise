import { AssuranceStorageService } from "./assurance-storage.service";
import { ContinuousAssuranceService } from "./continuous-assurance.service";
import { ComplianceDriftService } from "./compliance-drift.service";
import { EnterpriseRiskService } from "./enterprise-risk.service";
import { IncidentReadinessService } from "./incident-readiness.service";
import { RemediationService } from "./remediation.service";
import { AssuranceReport } from "./types/production-hardening-v7.types";
export declare class AssuranceReportService {
    private readonly storage;
    private readonly assurance;
    private readonly drift;
    private readonly risks;
    private readonly readiness;
    private readonly remediation;
    private readonly collection;
    constructor(storage: AssuranceStorageService, assurance: ContinuousAssuranceService, drift: ComplianceDriftService, risks: EnterpriseRiskService, readiness: IncidentReadinessService, remediation: RemediationService);
    generate(reportType?: AssuranceReport["reportType"]): Promise<AssuranceReport>;
    list(): Promise<AssuranceReport[]>;
    private calculateOverallStatus;
}
