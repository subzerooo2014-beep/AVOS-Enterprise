import { CreateGovernanceRequestDto, GovernanceActorDto, RecordGovernanceApprovalDto } from "../dto";
import { RuntimeGovernanceRequestService } from "../services";
export declare class RuntimeGovernanceRequestController {
    private readonly requests;
    constructor(requests: RuntimeGovernanceRequestService);
    create(dto: CreateGovernanceRequestDto): import("..").GovernanceRequest;
    list(): import("..").GovernanceRequest[];
    get(id: string): import("..").GovernanceRequest;
    recordApproval(id: string, dto: RecordGovernanceApprovalDto): import("..").GovernanceRequest;
    execute(id: string, actor: GovernanceActorDto): import("..").GovernanceRequest;
}
