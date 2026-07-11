import { ApprovalSubmitDto } from "./dto/approval-submit.dto";
import { CreateRiskTreatmentDto } from "./dto/create-risk-treatment.dto";
import { UpdateOperationalStatusDto } from "./dto/update-operational-status.dto";
import { UpdateRiskTreatmentStatusDto } from "./dto/update-risk-treatment-status.dto";
import { RiskTreatmentService } from "./risk-treatment.service";
import { RiskTreatmentStatus } from "./types/mega-pack-6.types";
export declare class RiskTreatmentController {
    private readonly treatments;
    constructor(treatments: RiskTreatmentService);
    create(dto: CreateRiskTreatmentDto): Promise<import("./types/mega-pack-6.types").RiskTreatmentPlan>;
    list(status?: RiskTreatmentStatus): Promise<import("./types/mega-pack-6.types").RiskTreatmentPlan[]>;
    summary(): Promise<{
        total: number;
        draft: number;
        pendingApproval: number;
        approved: number;
        executing: number;
        completed: number;
        rejected: number;
    }>;
    get(id: string): Promise<import("./types/mega-pack-6.types").RiskTreatmentPlan>;
    submitApproval(id: string, dto: ApprovalSubmitDto): Promise<import("./types/mega-pack-6.types").RiskTreatmentPlan>;
    syncApproval(id: string): Promise<import("./types/mega-pack-6.types").RiskTreatmentPlan>;
    updateStatus(id: string, dto: UpdateRiskTreatmentStatusDto): Promise<import("./types/mega-pack-6.types").RiskTreatmentPlan>;
    updateTaskStatus(planId: string, taskId: string, dto: UpdateOperationalStatusDto): Promise<import("./types/mega-pack-6.types").RiskTreatmentPlan>;
}
