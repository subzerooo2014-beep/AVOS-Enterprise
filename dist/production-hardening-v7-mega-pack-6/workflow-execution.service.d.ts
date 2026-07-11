import { CreateWorkflowDefinitionDto } from "./dto/create-workflow-definition.dto";
import { StartWorkflowDto } from "./dto/start-workflow.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { WorkflowDefinition, WorkflowExecution } from "./types/mega-pack-6.types";
export declare class WorkflowExecutionService {
    private readonly storage;
    private readonly sequence;
    private readonly events;
    constructor(storage: MegaPack6StorageService, sequence: EnterpriseSequenceService, events: PlatformEventBusService);
    createDefinition(dto: CreateWorkflowDefinitionDto): Promise<WorkflowDefinition>;
    listDefinitions(): Promise<WorkflowDefinition[]>;
    getDefinition(id: string): Promise<WorkflowDefinition>;
    start(workflowId: string, dto: StartWorkflowDto): Promise<WorkflowExecution>;
    execute(executionId: string): Promise<WorkflowExecution>;
    getExecution(id: string): Promise<WorkflowExecution>;
    listExecutions(): Promise<WorkflowExecution[]>;
    private executeStep;
    private saveExecution;
}
