import { Body, Controller, Post } from "@nestjs/common";
import { CapabilityGraphService } from "./capability-graph.service";

@Controller("capability-graph")
export class CapabilityGraphController {

  constructor(
    private readonly service:CapabilityGraphService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
