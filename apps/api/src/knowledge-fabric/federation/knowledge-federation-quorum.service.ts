import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgeFederationQuorumService { evaluate(contacted:number,succeeded:number,mode:string){ const required=mode==="QUORUM"?Math.max(1,Math.ceil(contacted/2)):1; return {required,succeeded,met:succeeded>=required,evaluatedAt:new Date().toISOString()}; } }