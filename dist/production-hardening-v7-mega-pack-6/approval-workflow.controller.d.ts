import { ApprovalWorkflowService } from "./approval-workflow.service";
import { ApprovalVoteDto } from "./dto/approval-vote.dto";
import { CreateApprovalRequestDto } from "./dto/create-approval-request.dto";
import { ApprovalDecision } from "./types/mega-pack-6.types";
export declare class ApprovalWorkflowController {
    private readonly approvals;
    constructor(approvals: ApprovalWorkflowService);
    create(dto: CreateApprovalRequestDto): Promise<import("./types/mega-pack-6.types").ApprovalRequest>;
    list(decision?: ApprovalDecision): Promise<import("./types/mega-pack-6.types").ApprovalRequest[]>;
    get(id: string): Promise<import("./types/mega-pack-6.types").ApprovalRequest>;
    vote(id: string, dto: ApprovalVoteDto): Promise<import("./types/mega-pack-6.types").ApprovalRequest>;
    cancel(id: string, actor: string): Promise<import("./types/mega-pack-6.types").ApprovalRequest>;
    expirePending(): Promise<{
        evaluated: number;
        expired: number;
    }>;
}
