import { Body, Controller, Post } from "@nestjs/common";
import { DomainModelEngineService } from "./domain-model-engine.service";

@Controller("domain-model-engine")
export class DomainModelEngineController {

  constructor(
    private readonly service:DomainModelEngineService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
