import { Injectable } from "@nestjs/common";
import { FederationNode, FederationResultItem } from "./knowledge-federation.types";
@Injectable()
export class KnowledgeFederationAdapterService {
  query(node:FederationNode,query:string):FederationResultItem[]{ const normalized=query.trim().toLowerCase(); if(!normalized)return[]; const score=Math.min(1,0.55+normalized.length/100); return [{nodeId:node.id,knowledgeId:`${node.namespace}:${normalized.replace(/\s+/g,"-")}`,score,confidence:Math.min(1,score+0.1),payload:{query,source:node.name,endpoint:node.endpoint,version:node.version}}]; }
  health(node:FederationNode){ return {nodeId:node.id,reachable:node.state!=="OFFLINE",latencyMs:node.state==="ACTIVE"?24:250,checkedAt:new Date().toISOString()}; }
}