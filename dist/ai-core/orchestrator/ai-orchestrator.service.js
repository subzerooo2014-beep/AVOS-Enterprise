"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const workflow_engine_service_1 = require("../workflow/workflow-engine.service");
const event_bus_service_1 = require("../events/event-bus.service");
const task_queue_service_1 = require("../queue/task-queue.service");
const scheduler_service_1 = require("../scheduler/scheduler.service");
const approval_pipeline_service_1 = require("../approval/approval-pipeline.service");
let AiOrchestratorService = class AiOrchestratorService {
    constructor(workflow, events, queue, scheduler, approval) {
        this.workflow = workflow;
        this.events = events;
        this.queue = queue;
        this.scheduler = scheduler;
        this.approval = approval;
    }
    async execute(input) {
        const review = this.approval.evaluate(input);
        const queued = this.queue.push(input);
        const wf = this.workflow.execute(input);
        this.events.publish("workflow.started", wf);
        return {
            review,
            queued,
            workflow: wf,
        };
    }
};
exports.AiOrchestratorService = AiOrchestratorService;
exports.AiOrchestratorService = AiOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [workflow_engine_service_1.WorkflowEngineService,
        event_bus_service_1.EventBusService,
        task_queue_service_1.TaskQueueService,
        scheduler_service_1.SchedulerService,
        approval_pipeline_service_1.ApprovalPipelineService])
], AiOrchestratorService);
//# sourceMappingURL=ai-orchestrator.service.js.map