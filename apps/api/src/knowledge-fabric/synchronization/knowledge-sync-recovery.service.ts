import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgeSyncRecoveryService { recover(input:{jobId:string;attempt:number;maxAttempts:number}){ const retry=input.attempt<input.maxAttempts; return {jobId:input.jobId,retry,nextAttempt:retry?input.attempt+1:input.attempt,backoffMs:retry?Math.min(30000,1000*2**input.attempt):0,recoveredAt:new Date().toISOString()}; } }