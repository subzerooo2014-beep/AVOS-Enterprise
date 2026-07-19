import { Body, Controller, Post } from "@nestjs/common";
import { CompilerMetricsService } from "./compiler-metrics.service";

@Controller("compiler/compiler-metrics")
export class CompilerMetricsController {

  constructor(
    private readonly service:CompilerMetricsService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
