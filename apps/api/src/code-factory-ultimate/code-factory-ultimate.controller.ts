import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { EnqueueJobDto, GenerateDto, ArchitectDto, HumanDecisionDto, CertifyDto } from "./dto/ultimate.dto";
import { DurableJobQueueService } from "./mp5/durable-job-queue.service";
import { DistributedWorkerService } from "./mp5/distributed-worker.service";
import { UniversalGenerationService } from "./mp6/universal-generation.service";
import { AutonomousSoftwareArchitectService } from "./mp7/autonomous-software-architect.service";
import { UltimateVerificationService } from "./mp8/ultimate-verification.service";
import { UltimateSmokeService } from "./mp8/ultimate-smoke.service";
import { UltimateCertificationService } from "./mp8/ultimate-certification.service";
import { UltimateStatusService } from "./ultimate-status.service";

@Controller("avos/code-factory/ultimate")
export class CodeFactoryUltimateController {
 constructor(private readonly statusService:UltimateStatusService,private readonly queue:DurableJobQueueService,private readonly worker:DistributedWorkerService,private readonly generator:UniversalGenerationService,private readonly architect:AutonomousSoftwareArchitectService,private readonly verification:UltimateVerificationService,private readonly smoke:UltimateSmokeService,private readonly certification:UltimateCertificationService){}
 @Get("status") status(){return this.statusService.status();}
 @Post("jobs") enqueue(@Body() dto:EnqueueJobDto){return this.queue.enqueue(dto.type,dto.payload,dto);}
 @Get("jobs") jobs(@Query("status") status?:string){return this.queue.list(status);}
 @Get("jobs/:id") job(@Param("id") id:string){return this.queue.get(id);}
 @Post("jobs/:id/retry") retry(@Param("id") id:string){return this.queue.retry(id);}
 @Post("jobs/:id/cancel") cancel(@Param("id") id:string){return this.queue.cancel(id);}
 @Get("workers/status") workers(){return this.worker.status();}
 @Post("workers/tick") tick(){return this.worker.tick();}
 @Get("generation/supported") supported(){return this.generator.supported();}
 @Post("generation/generate") generate(@Body() dto:GenerateDto){return this.generator.generate(dto.blueprint,dto.materialize??true);}
 @Get("generation/packages") packages(){return this.generator.list();}
 @Post("architect/plan") plan(@Body() dto:ArchitectDto){return this.architect.plan(dto.objective,dto.preferredLanguage,dto.preferredFramework,dto.constraints);}
 @Get("architect/plans") plans(){return this.architect.list();}
 @Post("architect/plans/:id/approve") approve(@Param("id") id:string,@Body() dto:HumanDecisionDto){return this.architect.approve(id,dto.approvedBy);}
 @Post("architect/plans/:id/reject") reject(@Param("id") id:string,@Body() dto:HumanDecisionDto){return this.architect.reject(id,dto.approvedBy);}
 @Post("architect/plans/:id/generate") architectGenerate(@Param("id") id:string){return this.architect.generate(id,true);}
 @Post("verification/run") verify(){return this.verification.run();}
 @Post("smoke/run") smokeRun(){return this.smoke.run();}
 @Post("certification/certify") certify(@Body() dto:CertifyDto){return this.certification.certify(dto.approvedBy);}
 @Get("certification/status") certificationStatus(){return this.certification.status();}
}
