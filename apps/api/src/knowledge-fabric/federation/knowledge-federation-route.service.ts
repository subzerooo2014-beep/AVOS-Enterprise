import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { FederationRoute } from "./knowledge-federation.types";
@Injectable()
export class KnowledgeFederationRouteService {
  private readonly routes: FederationRoute[]=[];
  add(input:Omit<FederationRoute,"id"|"createdAt">){ const route:FederationRoute={...input,id:randomUUID(),createdAt:new Date().toISOString()}; this.routes.push(route); return route; }
  resolve(namespace:string){ return this.routes.filter(r=>r.enabled&&r.namespace===namespace).sort((a,b)=>a.priority-b.priority); }
  list(){ return [...this.routes]; }
  count(){ return this.routes.length; }
}