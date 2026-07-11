import { AssuranceReportService } from "./assurance-report.service";
import { ComplianceDriftService } from "./compliance-drift.service";
import { ContinuousAssuranceService } from "./continuous-assurance.service";
import { EnterpriseRiskService } from "./enterprise-risk.service";
import { IncidentReadinessService } from "./incident-readiness.service";
import { KeyLifecycleService } from "./key-lifecycle.service";
import { RemediationService } from "./remediation.service";
import { RetentionPolicyService } from "./retention-policy.service";
export declare class ProductionHardeningV7Service {
    private readonly assurance;
    private readonly drift;
    private readonly risks;
    private readonly readiness;
    private readonly keys;
    private readonly retention;
    private readonly remediation;
    private readonly reports;
    constructor(assurance: ContinuousAssuranceService, drift: ComplianceDriftService, risks: EnterpriseRiskService, readiness: IncidentReadinessService, keys: KeyLifecycleService, retention: RetentionPolicyService, remediation: RemediationService, reports: AssuranceReportService);
    bootstrap(): Promise<Record<string, unknown>>;
    executeFullCycle(): Promise<Record<string, unknown>>;
    status(): Promise<Record<string, unknown>>;
}
