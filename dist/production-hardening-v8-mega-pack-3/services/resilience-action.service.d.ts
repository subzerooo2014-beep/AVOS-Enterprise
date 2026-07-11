import { ResilienceAction } from "../contracts/runtime-resilience.contracts";
import { CreateResilienceActionDto, ExecuteResilienceActionDto } from "../dto";
import { ResilienceActionExecutorRegistry } from "../executors/resilience-action-executor.registry";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
import { RuntimeIncidentService } from "./runtime-incident.service";
export declare class ResilienceActionService {
    private readonly store;
    private readonly evidence;
    private readonly executors;
    private readonly incidents;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService, executors: ResilienceActionExecutorRegistry, incidents: RuntimeIncidentService);
    create(dto: CreateResilienceActionDto): ResilienceAction;
    list(): ResilienceAction[];
    get(id: string): ResilienceAction;
    approve(id: string, dto: ExecuteResilienceActionDto): ResilienceAction;
    execute(id: string, dto: ExecuteResilienceActionDto): Promise<ResilienceAction>;
    cancel(id: string, dto: ExecuteResilienceActionDto): ResilienceAction;
}
