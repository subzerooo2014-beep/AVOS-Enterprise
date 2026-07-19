import { Injectable } from "@nestjs/common";
import { DurableJobQueueService } from "../mp5/durable-job-queue.service";
import { DistributedWorkerService } from "../mp5/distributed-worker.service";
import { UniversalGenerationService } from "../mp6/universal-generation.service";
import { AutonomousSoftwareArchitectService } from "../mp7/autonomous-software-architect.service";

@Injectable()
export class UltimateSmokeService {
 constructor(private readonly queue:DurableJobQueueService,private readonly worker:DistributedWorkerService,private readonly generator:UniversalGenerationService,private readonly architect:AutonomousSoftwareArchitectService){}
 async run():Promise<Record<string,unknown>>{
  const job=await this.queue.enqueue("factory.echo",{smoke:true},{priority:100}); await this.worker.tick(); const completed=await this.queue.get(job.id);
  const pkg=await this.generator.generate({name:"ultimate-smoke-service",language:"typescript",framework:"nestjs"},false);
  const plan=await this.architect.plan("Build a governed smoke test API","typescript","nestjs",{}); await this.architect.approve(plan.id,"human:smoke-authority"); const generated=await this.architect.generate(plan.id,false);
  const checks={durableJobCompleted:completed?.status==="completed",workerExecution:Boolean(completed?.result),typescriptGeneration:pkg.files.length>=3,packageManifest:Boolean(pkg.manifest),architecturePlanCreated:Boolean(plan.id),humanApprovalEnforced:plan.requiresHumanApproval===true,approvedPlanGenerated:Boolean(generated.package)};
  const score=Math.round(Object.values(checks).filter(Boolean).length/Object.keys(checks).length*100);return {status:score===100?"passed":"failed",score,checks,evidence:{jobId:job.id,packageId:pkg.id,planId:plan.id},completedAt:new Date().toISOString()};
 }
}
