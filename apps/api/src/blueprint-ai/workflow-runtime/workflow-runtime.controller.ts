import { Body, Controller, Post } from "@nestjs/common";
import { WorkflowRuntimeService } from "./workflow-runtime.service";

@Controller("workflow-runtime")
export class WorkflowRuntimeController {

  constructor(
    private readonly service:WorkflowRuntimeService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
