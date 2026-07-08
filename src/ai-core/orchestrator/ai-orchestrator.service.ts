import { Injectable } from "@nestjs/common";
import { WorkflowEngineService } from "../workflow/workflow-engine.service";
import { EventBusService } from "../events/event-bus.service";
import { TaskQueueService } from "../queue/task-queue.service";
import { SchedulerService } from "../scheduler/scheduler.service";
import { ApprovalPipelineService } from "../approval/approval-pipeline.service";

@Injectable()
export class AiOrchestratorService{

 constructor(
  private workflow:WorkflowEngineService,
  private events:EventBusService,
  private queue:TaskQueueService,
  private scheduler:SchedulerService,
  private approval:ApprovalPipelineService,
 ){}

 async execute(input:any){

   const review=this.approval.evaluate(input);

   const queued=this.queue.push(input);

   const wf=this.workflow.execute(input);

   this.events.publish("workflow.started",wf);

   return{
      review,
      queued,
      workflow:wf,
   };

 }

}
