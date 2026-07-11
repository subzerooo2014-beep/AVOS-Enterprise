import { CreateWorkflowDefinitionDto } from "./dto/create-workflow-definition.dto";
import { StartWorkflowDto } from "./dto/start-workflow.dto";
import { WorkflowExecutionService } from "./workflow-execution.service";
export declare class WorkflowExecutionController {
    private readonly workflows;
    constructor(workflows: WorkflowExecutionService);
    createDefinition(dto: CreateWorkflowDefinitionDto): Promise<import(".").WorkflowDefinition>;
    listDefinitions(): Promise<import(".").WorkflowDefinition[]>;
    getDefinition(id: string): Promise<import(".").WorkflowDefinition>;
    start(id: string, dto: StartWorkflowDto): Promise<import(".").WorkflowExecution>;
    execute(id: string): Promise<import(".").WorkflowExecution>;
    listExecutions(): Promise<import(".").WorkflowExecution[]>;
    getExecution(id: string): Promise<import(".").WorkflowExecution>;
}
