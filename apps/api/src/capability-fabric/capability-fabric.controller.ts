
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateCapabilityDto } from "./dto/capability-fabric.dto";
import { CapabilityFabricService } from "./services/capability-fabric.service";
@Controller("avos/capability-fabric")
export class CapabilityFabricController{
 constructor(private readonly fabric:CapabilityFabricService){}
 @Get("health") health(){return this.fabric.health();}
 @Get("capabilities") list(){return this.fabric.list();}
 @Post("capabilities") create(@Body() dto:CreateCapabilityDto){return this.fabric.create(dto);}
 @Get("discover") discover(@Query("q") q=""){return this.fabric.discover(q);}
 @Get("graph") graph(){return this.fabric.graph();}
 @Post("final-review/run") review(){return this.fabric.review();}
 @Post("certification/certify") certify(){return this.fabric.certify();}
 @Get("certification/status") status(){return{review:this.fabric.review(),certification:this.fabric.certify(),health:this.fabric.health()};}
}