import { Injectable } from "@nestjs/common";
import { KnowledgeSyncJob } from "./knowledge-synchronization.types";
@Injectable()
export class KnowledgeSyncPlannerService { plan(job:KnowledgeSyncJob){ return {jobId:job.id,mode:job.mode,steps:["validate-endpoints","compare-checksums","detect-conflicts","transfer-delta","persist-checkpoint","publish-events"],estimatedChanges:Math.abs(job.source.version-job.target.version)+1,plannedAt:new Date().toISOString()}; } }