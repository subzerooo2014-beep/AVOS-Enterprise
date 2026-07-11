import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrchestratorService } from "./orchestrator.service";

@Controller("orchestrator")
export class OrchestratorController {
  constructor(private service:OrchestratorService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
