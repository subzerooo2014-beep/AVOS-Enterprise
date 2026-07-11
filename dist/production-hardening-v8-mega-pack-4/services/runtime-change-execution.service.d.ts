import { RuntimeChangeExecution } from "../contracts";
import { CreateRuntimeChangeExecutionDto, ExecuteRuntimeChangeDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeAutonomousRecoveryService } from "./runtime-autonomous-recovery.service";
import { RuntimeDecisionCenterService } from "./runtime-decision-center.service";
import { RuntimeExecutionEvidenceService } from "./runtime-execution-evidence.service";
import { RuntimeExecutionLockService } from "./runtime-execution-lock.service";
import { RuntimeGovernanceRequestService } from "./runtime-governance-request.service";
import { RuntimeRunbookService } from "./runtime-runbook.service";
export declare class RuntimeChangeExecutionService {
    private readonly store;
    private readonly requests;
    private readonly decisions;
    private readonly locks;
    private readonly runbooks;
    private readonly recovery;
    private readonly evidence;
    constructor(store: RuntimeGovernanceStore, requests: RuntimeGovernanceRequestService, decisions: RuntimeDecisionCenterService, locks: RuntimeExecutionLockService, runbooks: RuntimeRunbookService, recovery: RuntimeAutonomousRecoveryService, evidence: RuntimeExecutionEvidenceService);
    create(dto: CreateRuntimeChangeExecutionDto): RuntimeChangeExecution;
    list(): RuntimeChangeExecution[];
    get(id: string): RuntimeChangeExecution;
    validate(id: string, actor: {
        id: string;
        type: "user" | "service" | "system" | "automation";
        name?: string;
        roles: string[];
    }): RuntimeChangeExecution;
    execute(id: string, dto: ExecuteRuntimeChangeDto): Promise<RuntimeChangeExecution>;
    private buildValidations;
    private validation;
    private selectRunbook;
    private nextExecutionNumber;
}
