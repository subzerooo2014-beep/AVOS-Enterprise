import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EVOLUTION_CAPABILITIES } from "./continuous-evolution-sovereignty.registry";
import {
  EvolutionAssessment,
  EvolutionCapability,
  EvolutionDecision,
  EvolutionProgram
} from "./continuous-evolution-sovereignty.types";

@Injectable()
export class ContinuousEvolutionSovereigntyService {
  private readonly programs=new Map<string,EvolutionProgram>();
  private readonly assessments=new Map<string,EvolutionAssessment>();
  private readonly decisions=new Map<string,EvolutionDecision>();
  private readonly codes=new Set<string>();

  framework(){
    return{
      system:"AVOS Continuous Evolution & Sovereignty Ultra Bundle V1",
      status:"READY",
      capabilityCount:Object.keys(EVOLUTION_CAPABILITIES).length,
      capabilities:structuredClone(EVOLUTION_CAPABILITIES)
    };
  }

  createProgram(
    capability:EvolutionCapability,
    input:Omit<EvolutionProgram,"id"|"capability"|"status"|"createdAt"|"updatedAt">
  ){
    if(!EVOLUTION_CAPABILITIES[capability])throw new Error("Unknown capability");
    if(!/^\d+\.\d+\.\d+$/.test(input.version))throw new Error("Semantic version required");
    if(input.maturityScore<0||input.maturityScore>100||input.readinessScore<0||input.readinessScore>100)throw new Error("Scores must be between 0 and 100");
    const key=`${capability}:${input.code.trim().toUpperCase()}`;
    if(this.codes.has(key))throw new Error(`Duplicate program code: ${key}`);
    const now=new Date().toISOString();
    const item:EvolutionProgram={
      ...input,
      id:randomUUID(),
      capability,
      code:input.code.trim().toUpperCase(),
      name:input.name.trim(),
      owner:input.owner.trim(),
      status:"DRAFT",
      createdAt:now,
      updatedAt:now
    };
    this.programs.set(item.id,item);
    this.codes.add(key);
    return{...item};
  }

  activateProgram(id:string){
    const item=this.getProgram(id);
    if(item.readinessScore<60)throw new Error("Readiness score too low");
    item.status="ACTIVE";
    item.updatedAt=new Date().toISOString();
    this.programs.set(id,item);
    return{...item};
  }

  addAssessment(
    programId:string,
    input:Omit<EvolutionAssessment,"id"|"programId"|"createdAt">
  ){
    this.getProgram(programId);
    if(input.score<0||input.score>100)throw new Error("Assessment score invalid");
    const item:EvolutionAssessment={
      ...input,
      id:randomUUID(),
      programId,
      findings:[...input.findings],
      recommendations:[...input.recommendations],
      createdAt:new Date().toISOString()
    };
    this.assessments.set(item.id,item);
    return this.cloneAssessment(item);
  }

  createDecision(
    programId:string,
    input:Omit<EvolutionDecision,"id"|"programId"|"status"|"createdAt"|"updatedAt">
  ){
    this.getProgram(programId);
    const now=new Date().toISOString();
    const item:EvolutionDecision={
      ...input,
      id:randomUUID(),
      programId,
      consequences:[...input.consequences],
      status:"PROPOSED",
      createdAt:now,
      updatedAt:now
    };
    this.decisions.set(item.id,item);
    return this.cloneDecision(item);
  }

  updateDecision(id:string,status:EvolutionDecision["status"]){
    const item=this.decisions.get(id);
    if(!item)throw new Error("Decision not found");
    item.status=status;
    item.updatedAt=new Date().toISOString();
    this.decisions.set(id,item);
    return this.cloneDecision(item);
  }

  completeProgram(id:string){
    const item=this.getProgram(id);
    const assessmentCount=Array.from(this.assessments.values()).filter(x=>x.programId===id).length;
    const approvedDecisionCount=Array.from(this.decisions.values()).filter(x=>x.programId===id&&x.status==="APPROVED").length;
    if(assessmentCount===0)throw new Error("Assessment required");
    if(approvedDecisionCount===0)throw new Error("Approved decision required");
    item.status="COMPLETED";
    item.updatedAt=new Date().toISOString();
    this.programs.set(id,item);
    return{...item};
  }

  listPrograms(capability?:EvolutionCapability,tenantId?:string){
    return Array.from(this.programs.values())
      .filter(x=>!capability||x.capability===capability)
      .filter(x=>!tenantId||x.tenantId===tenantId)
      .map(x=>({...x}));
  }

  commandCenter(){
    const p=Array.from(this.programs.values());
    const a=Array.from(this.assessments.values());
    const d=Array.from(this.decisions.values());
    return{
      system:"AVOS Continuous Evolution & Sovereignty Ultra Bundle V1",
      capabilities:Object.keys(EVOLUTION_CAPABILITIES).length,
      programs:p.length,
      activePrograms:p.filter(x=>x.status==="ACTIVE").length,
      completedPrograms:p.filter(x=>x.status==="COMPLETED").length,
      assessments:a.length,
      decisions:d.length,
      approvedDecisions:d.filter(x=>x.status==="APPROVED").length,
      averageMaturity:p.length===0?0:Number((p.reduce((s,x)=>s+x.maturityScore,0)/p.length).toFixed(2)),
      averageReadiness:p.length===0?0:Number((p.reduce((s,x)=>s+x.readinessScore,0)/p.length).toFixed(2)),
      generatedAt:new Date().toISOString()
    };
  }

  private getProgram(id:string){
    const item=this.programs.get(id);
    if(!item)throw new Error("Program not found");
    return item;
  }

  private cloneAssessment(item:EvolutionAssessment):EvolutionAssessment{
    return{...item,findings:[...item.findings],recommendations:[...item.recommendations]};
  }

  private cloneDecision(item:EvolutionDecision):EvolutionDecision{
    return{...item,consequences:[...item.consequences]};
  }
}