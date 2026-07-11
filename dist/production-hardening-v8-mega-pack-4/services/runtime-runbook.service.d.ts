import { RuntimeRunbookDefinition, RuntimeRunbookExecution } from "../contracts";
import { CreateRuntimeRunbookDto, ExecuteRuntimeRunbookDto, UpdateRuntimeRunbookStatusDto } from "../dto";
import { RuntimeRunbookStepExecutor } from "../executors";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeRunbookService {
    private readonly store;
    private readonly executor;
    constructor(store: RuntimeGovernanceStore, executor: RuntimeRunbookStepExecutor);
    create(dto: CreateRuntimeRunbookDto): RuntimeRunbookDefinition;
    list(): RuntimeRunbookDefinition[];
    get(id: string): RuntimeRunbookDefinition;
    updateStatus(id: string, dto: UpdateRuntimeRunbookStatusDto): RuntimeRunbookDefinition;
    execute(id: string, dto: ExecuteRuntimeRunbookDto): Promise<RuntimeRunbookExecution>;
    listExecutions(): RuntimeRunbookExecution[];
    getExecution(id: string): RuntimeRunbookExecution;
}
