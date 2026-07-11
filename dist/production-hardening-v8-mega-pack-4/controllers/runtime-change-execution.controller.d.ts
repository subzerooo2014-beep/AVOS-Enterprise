import { CreateRuntimeChangeExecutionDto, ExecuteRuntimeChangeDto, GovernanceActorDto } from "../dto";
import { RuntimeChangeExecutionService } from "../services";
export declare class RuntimeChangeExecutionController {
    private readonly executions;
    constructor(executions: RuntimeChangeExecutionService);
    create(dto: CreateRuntimeChangeExecutionDto): import("..").RuntimeChangeExecution;
    list(): import("..").RuntimeChangeExecution[];
    get(id: string): import("..").RuntimeChangeExecution;
    validate(id: string, actor: GovernanceActorDto): import("..").RuntimeChangeExecution;
    execute(id: string, dto: ExecuteRuntimeChangeDto): Promise<import("..").RuntimeChangeExecution>;
}
