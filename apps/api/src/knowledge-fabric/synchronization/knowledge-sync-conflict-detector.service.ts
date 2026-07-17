import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeSyncConflict, KnowledgeSyncJob } from "./knowledge-synchronization.types";
@Injectable()
export class KnowledgeSyncConflictDetectorService {
  detect(job:KnowledgeSyncJob):KnowledgeSyncConflict[]{ if(job.source.version===job.target.version && job.source.checksum===job.target.checksum)return[]; return [{id:randomUUID(),jobId:job.id,knowledgeId:`${job.source.namespace}:root`,sourceVersion:job.source.version,targetVersion:job.target.version,sourceChecksum:job.source.checksum,targetChecksum:job.target.checksum,resolvable:job.strategy!=="MANUAL",strategy:job.strategy,detectedAt:new Date().toISOString()}]; }
  resolve(conflict:KnowledgeSyncConflict){ return {resolved:conflict.resolvable,strategy:conflict.strategy,resolvedAt:new Date().toISOString()}; }
}