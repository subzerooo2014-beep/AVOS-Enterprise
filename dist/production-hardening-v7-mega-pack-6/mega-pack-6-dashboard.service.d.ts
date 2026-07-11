import { ApprovalWorkflowService } from "./approval-workflow.service";
import { AutomatedRemediationService } from "./automated-remediation.service";
import { ComplianceBaselineService } from "./compliance-baseline.service";
import { ControlSchedulerService } from "./control-scheduler.service";
import { EvidenceChainService } from "./evidence-chain.service";
import { IncidentCommandService } from "./incident-command.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { RiskTreatmentService } from "./risk-treatment.service";
import { WorkflowExecutionService } from "./workflow-execution.service";
export declare class MegaPack6DashboardService {
    private readonly storage;
    private readonly baselines;
    private readonly approvals;
    private readonly incidents;
    private readonly treatments;
    private readonly workflows;
    private readonly remediations;
    private readonly evidence;
    private readonly scheduler;
    private readonly events;
    constructor(storage: MegaPack6StorageService, baselines: ComplianceBaselineService, approvals: ApprovalWorkflowService, incidents: IncidentCommandService, treatments: RiskTreatmentService, workflows: WorkflowExecutionService, remediations: AutomatedRemediationService, evidence: EvidenceChainService, scheduler: ControlSchedulerService, events: PlatformEventBusService);
    status(): Promise<Record<string, unknown>>;
}
