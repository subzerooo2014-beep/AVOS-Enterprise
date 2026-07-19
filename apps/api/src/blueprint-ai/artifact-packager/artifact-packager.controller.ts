import { Body, Controller, Post } from "@nestjs/common";
import { ArtifactPackagerService } from "./artifact-packager.service";

@Controller("artifact-packager")
export class ArtifactPackagerController {

  constructor(
    private readonly service:ArtifactPackagerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
