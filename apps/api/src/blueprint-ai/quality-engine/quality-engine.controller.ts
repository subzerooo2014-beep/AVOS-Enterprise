import { Body, Controller, Post } from "@nestjs/common";
import { QualityEngineService } from "./quality-engine.service";

@Controller("quality-engine")
export class QualityEngineController {

  constructor(
    private readonly service:QualityEngineService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
