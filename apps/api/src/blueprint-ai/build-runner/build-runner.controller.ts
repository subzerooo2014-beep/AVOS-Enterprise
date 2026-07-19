import { Body, Controller, Post } from "@nestjs/common";
import { BuildRunnerService } from "./build-runner.service";

@Controller("build-runner")
export class BuildRunnerController {

  constructor(
    private readonly service:BuildRunnerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
