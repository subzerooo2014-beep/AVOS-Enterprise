import { Injectable } from "@nestjs/common";
import { KnowledgeSyncCheckpoint } from "./knowledge-synchronization.types";
@Injectable()
export class KnowledgeSyncCheckpointStoreService {
  private readonly checkpoints = new Map<string, KnowledgeSyncCheckpoint[]>();
  record(input: Omit<KnowledgeSyncCheckpoint,"createdAt">): KnowledgeSyncCheckpoint { const value={...input,createdAt:new Date().toISOString()}; const list=this.checkpoints.get(input.jobId)??[]; list.push(value); this.checkpoints.set(input.jobId,list); return value; }
  latest(jobId:string){ const list=this.checkpoints.get(jobId)??[]; return list.length?list[list.length-1]:undefined; }
  history(jobId:string){ return [...(this.checkpoints.get(jobId)??[])]; }
  count(){ return [...this.checkpoints.values()].reduce((n,v)=>n+v.length,0); }
}