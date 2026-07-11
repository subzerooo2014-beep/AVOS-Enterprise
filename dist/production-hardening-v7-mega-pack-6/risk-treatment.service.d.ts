import { CreateRiskTreatmentDto } from "./dto/create-risk-treatment.dto";
import { ApprovalWorkflowService } from "./approval-workflow.service";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { OperationalStatus, RiskTreatmentPlan, RiskTreatmentStatus } from "./types/mega-pack-6.types";
export declare class RiskTreatmentService {
    private readonly storage;
    private readonly sequence;
    private readonly approvals;
    private readonly events;
    constructor(storage: MegaPack6StorageService, sequence: EnterpriseSequenceService, approvals: ApprovalWorkflowService, events: PlatformEventBusService);
    create(dto: CreateRiskTreatmentDto): Promise<RiskTreatmentPlan>;
    list(status?: RiskTreatmentStatus): Promise<RiskTreatmentPlan[]>;
    get(id: string): Promise<RiskTreatmentPlan>;
    submitForApproval(id: string, approvers: string[], minimumApprovals: number): Promise<RiskTreatmentPlan>;
    synchronizeApproval(id: string): Promise<RiskTreatmentPlan>;
    updateStatus(id: string, status: RiskTreatmentStatus): Promise<RiskTreatmentPlan>;
    updateTaskStatus(planId: string, taskId: string, status: OperationalStatus, output?: Record<string, unknown>): Promise<RiskTreatmentPlan>;
    summary(): Promise<{
        total: number;
        draft: number;
        pendingApproval: number;
        approved: number;
        executing: number;
        completed: number;
        rejected: number;
    }>;
    private validateStatusTransition;
}
