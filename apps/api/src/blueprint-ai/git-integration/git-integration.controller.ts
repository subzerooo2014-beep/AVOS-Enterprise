import { Body, Controller, Post } from "@nestjs/common";
import { GitIntegrationService } from "./git-integration.service";

@Controller("git-integration")
export class GitIntegrationController {

  constructor(
    private readonly service:GitIntegrationService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
