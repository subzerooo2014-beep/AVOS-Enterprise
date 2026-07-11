import { CreateRuntimeRunbookDto, ExecuteRuntimeRunbookDto, UpdateRuntimeRunbookStatusDto } from "../dto";
import { RuntimeRunbookService } from "../services";
export declare class RuntimeRunbookController {
    private readonly runbooks;
    constructor(runbooks: RuntimeRunbookService);
    create(dto: CreateRuntimeRunbookDto): import("..").RuntimeRunbookDefinition;
    list(): import("..").RuntimeRunbookDefinition[];
    listExecutions(): import("..").RuntimeRunbookExecution[];
    getExecution(id: string): import("..").RuntimeRunbookExecution;
    get(id: string): import("..").RuntimeRunbookDefinition;
    updateStatus(id: string, dto: UpdateRuntimeRunbookStatusDto): import("..").RuntimeRunbookDefinition;
    execute(id: string, dto: ExecuteRuntimeRunbookDto): Promise<import("..").RuntimeRunbookExecution>;
}
