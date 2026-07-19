import { Body, Controller, Post } from "@nestjs/common";
import { ExecutionRuntimeService } from "./execution-runtime.service";

@Controller("execution-runtime")
export class ExecutionRuntimeController {

  constructor(
    private readonly service:ExecutionRuntimeService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
