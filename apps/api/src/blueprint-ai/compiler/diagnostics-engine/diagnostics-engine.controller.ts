import { Body, Controller, Post } from "@nestjs/common";
import { DiagnosticsEngineService } from "./diagnostics-engine.service";

@Controller("compiler/diagnostics-engine")
export class DiagnosticsEngineController {

  constructor(
    private readonly service:DiagnosticsEngineService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
