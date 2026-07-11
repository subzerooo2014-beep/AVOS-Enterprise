import { AutomatedRemediationService } from "./automated-remediation.service";
import { ApprovalSubmitDto } from "./dto/approval-submit.dto";
import { CreateAutomatedRemediationDto } from "./dto/create-automated-remediation.dto";
import { ExecuteRemediationDto } from "./dto/execute-remediation.dto";
export declare class AutomatedRemediationController {
    private readonly remediations;
    constructor(remediations: AutomatedRemediationService);
    create(dto: CreateAutomatedRemediationDto): Promise<import("./automation.types").AutomatedRemediation>;
    list(): Promise<import("./automation.types").AutomatedRemediation[]>;
    get(id: string): Promise<import("./automation.types").AutomatedRemediation>;
    requestApproval(id: string, dto: ApprovalSubmitDto): Promise<import("./automation.types").AutomatedRemediation>;
    syncApproval(id: string): Promise<import("./automation.types").AutomatedRemediation>;
    execute(id: string, dto: ExecuteRemediationDto): Promise<import("./automation.types").AutomatedRemediation>;
}
