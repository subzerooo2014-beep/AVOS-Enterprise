import { Body, Controller, Post } from "@nestjs/common";
import { TestRunnerService } from "./test-runner.service";

@Controller("test-runner")
export class TestRunnerController {

  constructor(
    private readonly service:TestRunnerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
