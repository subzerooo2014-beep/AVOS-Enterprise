import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeSyncCheckpointStoreService } from "./knowledge-sync-checkpoint-store.service";
import { KnowledgeSyncConflictDetectorService } from "./knowledge-sync-conflict-detector.service";
import { KnowledgeSyncPlannerService } from "./knowledge-sync-planner.service";
import { KnowledgeSyncCompatibilityService } from "./knowledge-sync-compatibility.service";
import { KnowledgeSyncEventService } from "./knowledge-sync-event.service";
import { KnowledgeSyncJob, KnowledgeSyncResult } from "./knowledge-synchronization.types";
@Injectable()
export class KnowledgeSynchronizationEngineService {
  private readonly jobs=new Map<string,KnowledgeSyncJob>(); private completed=0; private failed=0;
  constructor(private readonly checkpoints:KnowledgeSyncCheckpointStoreService,private readonly conflicts:KnowledgeSyncConflictDetectorService,private readonly planner:KnowledgeSyncPlannerService,private readonly compatibility:KnowledgeSyncCompatibilityService,private readonly events:KnowledgeSyncEventService){}
  create(input:Omit<KnowledgeSyncJob,"id"|"state"|"attempts"|"createdAt"|"updatedAt">){ const now=new Date().toISOString(); const job:KnowledgeSyncJob={...input,id:randomUUID(),state:"QUEUED",attempts:0,createdAt:now,updatedAt:now}; this.jobs.set(job.id,job); this.events.publish("knowledge.sync.queued",{jobId:job.id}); return job; }
  get(id:string){ const job=this.jobs.get(id); if(!job)throw new NotFoundException("Knowledge synchronization job was not found"); return job; }
  execute(id:string):KnowledgeSyncResult { const job=this.get(id); const compat=this.compatibility.evaluate(job.source,job.target); if(!compat.compatible){ job.state="FAILED"; this.failed++; throw new Error("Synchronization endpoints are incompatible"); } job.state="RUNNING"; job.attempts++; job.updatedAt=new Date().toISOString(); this.planner.plan(job); const conflicts=this.conflicts.detect(job); const unresolved=conflicts.some(c=>!c.resolvable); if(unresolved){job.state="CONFLICTED";}else{job.state="COMPLETED";this.completed++;} const transferred=Math.max(1,Math.abs(job.source.version-job.target.version)); const checkpoint=this.checkpoints.record({jobId:job.id,sequence:job.attempts,cursor:`v${Math.max(job.source.version,job.target.version)}`,processed:transferred,failed:unresolved?1:0}); this.events.publish("knowledge.sync.completed",{jobId:job.id,state:job.state}); return {job,transferred,skipped:0,conflicts,checkpoint,completedAt:new Date().toISOString()}; }
  retry(id:string){ const job=this.get(id); job.state="RETRYING"; return this.execute(id); }
  metrics(){ return {jobs:this.jobs.size,completed:this.completed,failed:this.failed,checkpoints:this.checkpoints.count(),events:this.events.count()}; }
}