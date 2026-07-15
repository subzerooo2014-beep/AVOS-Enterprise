import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { GLOBAL_SCALE_CAPABILITIES } from "./global-scale-ultra.registry";
import { GlobalScaleCapability,GlobalScaleMilestone,GlobalScaleProgram,GlobalScaleRisk } from "./global-scale-ultra.types";

@Injectable()
export class GlobalScaleUltraService {
  private readonly programs=new Map<string,GlobalScaleProgram>();
  private readonly milestones=new Map<string,GlobalScaleMilestone>();
  private readonly risks=new Map<string,GlobalScaleRisk>();
  private readonly codes=new Set<string>();

  framework(){return{system:"AVOS Global Scale Ultra Bundle V1",status:"READY",capabilityCount:Object.keys(GLOBAL_SCALE_CAPABILITIES).length,capabilities:structuredClone(GLOBAL_SCALE_CAPABILITIES)}}

  createProgram(capability:GlobalScaleCapability,input:Omit<GlobalScaleProgram,"id"|"capability"|"status"|"createdAt"|"updatedAt">){
    const key=`${capability}:${input.code.trim().toUpperCase()}`;
    if(this.codes.has(key))throw new Error(`Duplicate program code: ${key}`);
    if(input.budget<0||input.riskScore<0||input.riskScore>100||input.readinessScore<0||input.readinessScore>100)throw new Error("Invalid budget or scores");
    const now=new Date().toISOString();
    const item:GlobalScaleProgram={...input,id:randomUUID(),capability,code:input.code.trim().toUpperCase(),name:input.name.trim(),owner:input.owner.trim(),status:"DRAFT",createdAt:now,updatedAt:now};
    this.programs.set(item.id,item);this.codes.add(key);return{...item};
  }

  activateProgram(id:string){
    const p=this.getProgram(id);
    if(p.readinessScore<60)throw new Error("Readiness score too low");
    p.status="ACTIVE";p.updatedAt=new Date().toISOString();return{...p};
  }

  addMilestone(programId:string,input:Omit<GlobalScaleMilestone,"id"|"programId"|"status"|"createdAt"|"updatedAt">){
    this.getProgram(programId);
    const now=new Date().toISOString();
    const m:GlobalScaleMilestone={...input,id:randomUUID(),programId,status:"PLANNED",evidence:[...input.evidence],createdAt:now,updatedAt:now};
    this.milestones.set(m.id,m);return{...m,evidence:[...m.evidence]};
  }

  updateMilestone(id:string,status:GlobalScaleMilestone["status"],evidence?:string){
    const m=this.milestones.get(id);if(!m)throw new Error("Milestone not found");
    m.status=status;if(evidence)m.evidence.push(evidence);m.updatedAt=new Date().toISOString();
    return{...m,evidence:[...m.evidence]};
  }

  addRisk(programId:string,input:Omit<GlobalScaleRisk,"id"|"programId"|"status"|"createdAt"|"updatedAt">){
    this.getProgram(programId);
    if(input.probability<0||input.probability>100||input.impact<0||input.impact>100)throw new Error("Invalid risk scores");
    const now=new Date().toISOString();
    const r:GlobalScaleRisk={...input,id:randomUUID(),programId,status:"OPEN",createdAt:now,updatedAt:now};
    this.risks.set(r.id,r);return{...r};
  }

  updateRisk(id:string,status:GlobalScaleRisk["status"]){
    const r=this.risks.get(id);if(!r)throw new Error("Risk not found");
    r.status=status;r.updatedAt=new Date().toISOString();return{...r};
  }

  listPrograms(capability?:GlobalScaleCapability,tenantId?:string){
    return Array.from(this.programs.values()).filter(x=>!capability||x.capability===capability).filter(x=>!tenantId||x.tenantId===tenantId).map(x=>({...x}));
  }

  commandCenter(){
    const p=Array.from(this.programs.values()),m=Array.from(this.milestones.values()),r=Array.from(this.risks.values());
    return{system:"AVOS Global Scale Ultra Bundle V1",capabilities:Object.keys(GLOBAL_SCALE_CAPABILITIES).length,programs:p.length,activePrograms:p.filter(x=>x.status==="ACTIVE").length,milestones:m.length,completedMilestones:m.filter(x=>x.status==="COMPLETED").length,risks:r.length,criticalOpenRisks:r.filter(x=>x.status!=="CLOSED"&&x.severity==="CRITICAL").length,totalBudget:Number(p.reduce((s,x)=>s+x.budget,0).toFixed(2)),generatedAt:new Date().toISOString()};
  }

  private getProgram(id:string){const p=this.programs.get(id);if(!p)throw new Error("Program not found");return p;}
}