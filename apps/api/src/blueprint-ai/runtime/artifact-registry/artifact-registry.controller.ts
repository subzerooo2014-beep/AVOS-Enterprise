import { Body, Controller, Post } from "@nestjs/common";
import { ArtifactRegistryService } from "./artifact-registry.service";

@Controller("runtime/artifact-registry")
export class ArtifactRegistryController{

 constructor(private readonly service:ArtifactRegistryService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
