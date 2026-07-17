import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { FederationNode } from "./knowledge-federation.types";
@Injectable()
export class KnowledgeFederationRegistryService {
  private readonly nodes = new Map<string,FederationNode>();
  register(input:Omit<FederationNode,"id"|"state"|"registeredAt"|"updatedAt">){ const now=new Date().toISOString(); const node:FederationNode={...input,id:randomUUID(),state:"ACTIVE",registeredAt:now,updatedAt:now}; this.nodes.set(node.id,node); return node; }
  get(id:string){ const node=this.nodes.get(id); if(!node)throw new NotFoundException("Federation node was not found"); return node; }
  list(){ return [...this.nodes.values()]; }
  updateState(id:string,state:FederationNode["state"]){ const node=this.get(id); node.state=state; node.updatedAt=new Date().toISOString(); return node; }
  count(){ return this.nodes.size; }
}