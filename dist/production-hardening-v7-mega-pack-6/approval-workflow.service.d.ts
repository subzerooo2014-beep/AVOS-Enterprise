import { ApprovalVoteDto } from "./dto/approval-vote.dto";
import { CreateApprovalRequestDto } from "./dto/create-approval-request.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { ApprovalDecision, ApprovalRequest } from "./types/mega-pack-6.types";
export declare class ApprovalWorkflowService {
    private readonly storage;
    private readonly sequence;
    private readonly events;
    constructor(storage: MegaPack6StorageService, sequence: EnterpriseSequenceService, events: PlatformEventBusService);
    create(dto: CreateApprovalRequestDto): Promise<ApprovalRequest>;
    list(decision?: ApprovalDecision): Promise<ApprovalRequest[]>;
    get(id: string): Promise<ApprovalRequest>;
    vote(id: string, dto: ApprovalVoteDto): Promise<ApprovalRequest>;
    cancel(id: string, actor: string): Promise<ApprovalRequest>;
    expirePendingRequests(): Promise<{
        evaluated: number;
        expired: number;
    }>;
    private expireRequest;
}
