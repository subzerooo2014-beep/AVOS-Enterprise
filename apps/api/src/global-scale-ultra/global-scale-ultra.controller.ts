import { Body,Controller,Get,Param,Patch,Post,Query } from "@nestjs/common";
import { GlobalScaleUltraService } from "./global-scale-ultra.service";
import { GlobalScaleCapability,GlobalScaleMilestone,GlobalScaleProgram,GlobalScaleRisk } from "./global-scale-ultra.types";

@Controller("global-scale-ultra")
export class GlobalScaleUltraController {
  constructor(private readonly service:GlobalScaleUltraService){}
  @Get() framework(){return this.service.framework();}
  @Post(":capability/programs") createProgram(@Param("capability") capability:GlobalScaleCapability,@Body() input:Omit<GlobalScaleProgram,"id"|"capability"|"status"|"createdAt"|"updatedAt">){return this.service.createProgram(capability,input);}
  @Get("programs") listPrograms(@Query("capability") capability?:GlobalScaleCapability,@Query("tenantId") tenantId?:string){return this.service.listPrograms(capability,tenantId);}
  @Patch("programs/:id/activate") activate(@Param("id") id:string){return this.service.activateProgram(id);}
  @Post("programs/:id/milestones") milestone(@Param("id") id:string,@Body() input:Omit<GlobalScaleMilestone,"id"|"programId"|"status"|"createdAt"|"updatedAt">){return this.service.addMilestone(id,input);}
  @Patch("milestones/:id/status") milestoneStatus(@Param("id") id:string,@Body() body:{status:GlobalScaleMilestone["status"];evidence?:string}){return this.service.updateMilestone(id,body.status,body.evidence);}
  @Post("programs/:id/risks") risk(@Param("id") id:string,@Body() input:Omit<GlobalScaleRisk,"id"|"programId"|"status"|"createdAt"|"updatedAt">){return this.service.addRisk(id,input);}
  @Patch("risks/:id/status") riskStatus(@Param("id") id:string,@Body() body:{status:GlobalScaleRisk["status"]}){return this.service.updateRisk(id,body.status);}
  @Get("command-center") command(){return this.service.commandCenter();}
}