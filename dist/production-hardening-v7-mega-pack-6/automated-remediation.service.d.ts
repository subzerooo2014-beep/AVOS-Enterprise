import { ApprovalWorkflowService } from "./approval-workflow.service";
import { CreateAutomatedRemediationDto } from "./dto/create-automated-remediation.dto";
import { ExecuteRemediationDto } from "./dto/execute-remediation.dto";
import { EvidenceChainService } from "./evidence-chain.service";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { AutomatedRemediation } from "./automation.types";
export declare class AutomatedRemediationService {
    private readonly storage;
    private readonly sequence;
    private readonly approvals;
    private readonly evidence;
    private readonly events;
    constructor(storage: MegaPack6StorageService, sequence: EnterpriseSequenceService, approvals: ApprovalWorkflowService, evidence: EvidenceChainService, events: PlatformEventBusService);
    create(dto: CreateAutomatedRemediationDto): Promise<AutomatedRemediation>;
    list(): Promise<AutomatedRemediation[]>;
    get(id: string): Promise<AutomatedRemediation>;
    requestApproval(id: string, approvers: string[], minimumApprovals: number): Promise<AutomatedRemediation>;
    synchronizeApproval(id: string): Promise<AutomatedRemediation>;
    execute(id: string, dto: ExecuteRemediationDto): Promise<AutomatedRemediation>;
    private executeAction;
    private save;
}
