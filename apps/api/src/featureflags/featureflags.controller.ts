import { Body, Controller, Get, Post } from "@nestjs/common";
import { FeatureflagsService } from "./featureflags.service";

@Controller("featureflags")
export class FeatureflagsController{
 constructor(private service:FeatureflagsService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
