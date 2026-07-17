
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApproveOrchestrationDto, CreateOrchestrationDto } from "./dto/autonomous-orchestration.dto";
import { AutonomousOrchestrationService } from "./services/autonomous-orchestration.service";
@Controller("avos/autonomous-orchestration")
export class AutonomousOrchestrationController{
 constructor(private readonly engine:AutonomousOrchestrationService){}
 @Get("health") health(){return this.engine.health();}
 @Get("runs") runs(){return this.engine.list();}
 @Post("runs") create(@Body() dto:CreateOrchestrationDto){return this.engine.create(dto);}
 @Post("approve") approve(@Body() dto:ApproveOrchestrationDto){return this.engine.approve(dto);}
 @Post("execute/:runId") execute(@Param("runId") runId:string){return this.engine.execute(runId);}
 @Post("final-review/run") review(){return this.engine.review();}
 @Post("certification/certify") certify(){return this.engine.certify();}
 @Get("certification/status") status(){return{review:this.engine.review(),certification:this.engine.certify(),health:this.engine.health()};}
}