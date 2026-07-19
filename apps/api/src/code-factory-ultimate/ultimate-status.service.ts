import { Injectable } from "@nestjs/common";
import { JsonFileStoreService } from "./infrastructure/json-file-store.service";
import { DurableJobQueueService } from "./mp5/durable-job-queue.service";
import { DistributedWorkerService } from "./mp5/distributed-worker.service";
import { UniversalGenerationService } from "./mp6/universal-generation.service";
import { AutonomousSoftwareArchitectService } from "./mp7/autonomous-software-architect.service";
import { UltimateCertificationService } from "./mp8/ultimate-certification.service";
@Injectable()
export class UltimateStatusService {
 constructor(private readonly store:JsonFileStoreService,private readonly queue:DurableJobQueueService,private readonly worker:DistributedWorkerService,private readonly generator:UniversalGenerationService,private readonly architect:AutonomousSoftwareArchitectService,private readonly certification:UltimateCertificationService){}
 async status():Promise<Record<string,unknown>>{const [queue,worker,packages,plans,certification]=await Promise.all([this.queue.metrics(),this.worker.status(),this.generator.list(),this.architect.list(),this.certification.status()]);return{name:"AVOS Code Factory Ultimate Mega Pack 5-8",version:"CF-V1.0.0",status:"operational",foundationStatus:"complete-after-certification",dataRoot:this.store.root,stages:{megaPack5:"Durable Job Queue, Workers & Execution",megaPack6:"Universal Multi-Language Generation",megaPack7:"Autonomous AI Software Architect",megaPack8:"Production Certification & Release"},metrics:{queue,worker,packages:packages.length,plans:plans.length},certification,humanFinalAuthority:true,globalComplianceReadinessGate:true};}
}
