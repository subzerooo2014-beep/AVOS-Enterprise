import { Body,Controller,Get,Param,Patch,Post,Query } from "@nestjs/common";
import { ContinuousEvolutionSovereigntyService } from "./continuous-evolution-sovereignty.service";
import {
  EvolutionAssessment,
  EvolutionCapability,
  EvolutionDecision,
  EvolutionProgram
} from "./continuous-evolution-sovereignty.types";

@Controller("continuous-evolution-sovereignty")
export class ContinuousEvolutionSovereigntyController {
  constructor(private readonly service:ContinuousEvolutionSovereigntyService){}

  @Get()
  framework(){return this.service.framework();}

  @Post(":capability/programs")
  createProgram(
    @Param("capability") capability:EvolutionCapability,
    @Body() input:Omit<EvolutionProgram,"id"|"capability"|"status"|"createdAt"|"updatedAt">
  ){return this.service.createProgram(capability,input);}

  @Get("programs")
  listPrograms(
    @Query("capability") capability?:EvolutionCapability,
    @Query("tenantId") tenantId?:string
  ){return this.service.listPrograms(capability,tenantId);}

  @Patch("programs/:id/activate")
  activate(@Param("id") id:string){return this.service.activateProgram(id);}

  @Post("programs/:id/assessments")
  assessment(
    @Param("id") id:string,
    @Body() input:Omit<EvolutionAssessment,"id"|"programId"|"createdAt">
  ){return this.service.addAssessment(id,input);}

  @Post("programs/:id/decisions")
  decision(
    @Param("id") id:string,
    @Body() input:Omit<EvolutionDecision,"id"|"programId"|"status"|"createdAt"|"updatedAt">
  ){return this.service.createDecision(id,input);}

  @Patch("decisions/:id/status")
  decisionStatus(
    @Param("id") id:string,
    @Body() body:{status:EvolutionDecision["status"]}
  ){return this.service.updateDecision(id,body.status);}

  @Post("programs/:id/complete")
  complete(@Param("id") id:string){return this.service.completeProgram(id);}

  @Get("command-center")
  command(){return this.service.commandCenter();}
}