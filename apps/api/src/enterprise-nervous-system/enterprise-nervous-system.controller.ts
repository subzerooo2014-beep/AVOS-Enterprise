
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PublishSignalDto } from "./dto/enterprise-nervous-system.dto";
import { EnterpriseNervousSystemService } from "./services/enterprise-nervous-system.service";
@Controller("avos/enterprise-nervous-system")
export class EnterpriseNervousSystemController{
 constructor(private readonly system:EnterpriseNervousSystemService){}
 @Get("health") health(){return this.system.health();}
 @Get("signals") signals(@Query("topic") topic?:string){return this.system.list(topic);}
 @Post("signals") publish(@Body() dto:PublishSignalDto){return this.system.publish(dto);}
 @Post("replay") replay(@Body("topic") topic:string){return this.system.replay(topic);}
 @Post("final-review/run") review(){return this.system.review();}
 @Post("certification/certify") certify(){return this.system.certify();}
 @Get("certification/status") status(){return{review:this.system.review(),certification:this.system.certify(),health:this.system.health()};}
}