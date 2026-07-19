import { Injectable } from "@nestjs/common";import { Grid,Workload } from "./planetary-production-intelligence.types";
@Injectable() export class PlanetaryProductionIntelligenceStore{
 readonly grids:Grid[]=[
 {id:"grid:uae",name:"AVOS UAE Sovereign Grid",region:"middle-east",jurisdictions:["AE"],status:"operational",trust:100,sovereignty:100,compliance:100,capacity:900,cost:52,carbon:42,latency:18,capabilities:["software-factory","mobility","finance","compliance"],dataResidency:true},
 {id:"grid:eu",name:"AVOS European Sovereign Grid",region:"europe",jurisdictions:["DE","FR","NL"],status:"operational",trust:99,sovereignty:100,compliance:100,capacity:760,cost:64,carbon:30,latency:28,capabilities:["software-factory","mobility","privacy","compliance"],dataResidency:true},
 {id:"grid:apac",name:"AVOS APAC Sovereign Grid",region:"asia-pacific",jurisdictions:["SG","JP","AU"],status:"operational",trust:98,sovereignty:99,compliance:98,capacity:680,cost:48,carbon:47,latency:34,capabilities:["software-factory","mobility","analytics"],dataResidency:true}
 ];readonly workloads:Workload[]=[];readonly policies:any[]=[];readonly coordinations:any[]=[];readonly exchanges:any[]=[];readonly trustLinks:any[]=[];readonly evolutions:any[]=[];
 id(p:string){return `${p}:${Date.now()}:${Math.random().toString(16).slice(2,10)}`};now(){return new Date().toISOString()}
}