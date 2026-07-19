import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ArchitecturePlan, SupportedLanguage } from "../types/ultimate.types";
import { JsonFileStoreService } from "../infrastructure/json-file-store.service";
import { UniversalGenerationService } from "../mp6/universal-generation.service";

@Injectable()
export class AutonomousSoftwareArchitectService {
  constructor(private readonly store: JsonFileStoreService, private readonly generator: UniversalGenerationService) {}
  async plan(objective:string, preferredLanguage?:SupportedLanguage, preferredFramework?:string, constraints:Record<string,unknown>={}):Promise<ArchitecturePlan> {
    const language = preferredLanguage ?? this.inferLanguage(objective); const framework=preferredFramework ?? this.framework(language);
    const now=new Date().toISOString(); const slug=objective.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48) || "autonomous-system";
    const components=[{name:"api",responsibility:"Expose governed application contracts",dependencies:["domain","audit"]},{name:"domain",responsibility:"Implement business capabilities",dependencies:["persistence"]},{name:"persistence",responsibility:"Store durable state and metadata",dependencies:[]},{name:"audit",responsibility:"Preserve traceability and human decisions",dependencies:[]}];
    const plan:ArchitecturePlan={id:`plan:${Date.now()}:${randomUUID()}`,objective,status:"awaiting-human-approval",confidence:0.84,risk:Object.keys(constraints).length>4?"high":"medium",recommendedLanguage:language,recommendedFramework:framework,components,blueprint:{name:slug,description:objective,language,framework,entities:[],endpoints:[{method:"GET",path:"/health",operation:"health"}],metadata:{constraints,generatedBy:"AVOS Autonomous Software Architect"}},rationale:["Capability-first modular boundaries","Durable persistence and auditability","Human approval before generation","Stable core with replaceable adapters"],requiresHumanApproval:true,createdAt:now,updatedAt:now};
    await this.persist(plan); return plan;
  }
  async list():Promise<ArchitecturePlan[]> { return this.store.listJson<ArchitecturePlan>(this.store.path("plans")); }
  async get(id:string):Promise<ArchitecturePlan|undefined>{ return this.store.readJson<ArchitecturePlan>(this.store.path("plans",`${id}.json`)); }
  async approve(id:string, approvedBy:string):Promise<ArchitecturePlan>{ if(!approvedBy.startsWith("human:")) throw new Error("Approval must be issued by a human authority identity"); const plan=await this.required(id); plan.status="approved";plan.approvedBy=approvedBy;plan.updatedAt=new Date().toISOString();await this.persist(plan);return plan; }
  async reject(id:string, approvedBy:string):Promise<ArchitecturePlan>{ if(!approvedBy.startsWith("human:")) throw new Error("Rejection must be issued by a human authority identity"); const plan=await this.required(id); plan.status="rejected";plan.approvedBy=approvedBy;plan.updatedAt=new Date().toISOString();await this.persist(plan);return plan; }
  async generate(id:string, materialize=true):Promise<Record<string,unknown>>{ const plan=await this.required(id); if(plan.status!=="approved") throw new Error("Human approval is required before autonomous generation"); const pkg=await this.generator.generate(plan.blueprint as unknown as Record<string,unknown>,materialize); plan.status="generated";plan.updatedAt=new Date().toISOString();await this.persist(plan);return {plan,package:pkg}; }
  private async required(id:string):Promise<ArchitecturePlan>{ const p=await this.get(id);if(!p)throw new Error(`Plan not found: ${id}`);return p; }
  private async persist(p:ArchitecturePlan):Promise<void>{ await this.store.writeJson(this.store.path("plans",`${p.id}.json`),p); }
  private inferLanguage(objective:string):SupportedLanguage{ const value=objective.toLowerCase(); if(value.includes("mobile")||value.includes("flutter"))return "dart";if(value.includes("data")||value.includes("ml")||value.includes("python"))return "python";if(value.includes("go service"))return "go";if(value.includes(".net")||value.includes("c#"))return "csharp";return "typescript"; }
  private framework(l:SupportedLanguage):string{return ({typescript:"nestjs",python:"fastapi",dart:"flutter",go:"net/http",csharp:"aspnetcore"})[l];}
}
