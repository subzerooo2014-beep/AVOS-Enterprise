import { WorkflowEngineService } from "../workflow/workflow-engine.service";
import { EventBusService } from "../events/event-bus.service";
import { TaskQueueService } from "../queue/task-queue.service";
import { SchedulerService } from "../scheduler/scheduler.service";
import { ApprovalPipelineService } from "../approval/approval-pipeline.service";
export declare class AiOrchestratorService {
    private workflow;
    private events;
    private queue;
    private scheduler;
    private approval;
    constructor(workflow: WorkflowEngineService, events: EventBusService, queue: TaskQueueService, scheduler: SchedulerService, approval: ApprovalPipelineService);
    execute(input: any): Promise<{
        review: {
            approved: boolean;
            stage: string;
            confidence: number;
            item: any;
        };
        queued: number;
        workflow: {
            workflowId: `${string}-${string}-${string}-${string}-${string}`;
            status: string;
            startedAt: string;
            workflow: any;
        };
    }>;
}
