import { Body, Controller, Post } from "@nestjs/common";
import { ArtifactLoaderService } from "./artifact-loader.service";

@Controller("runtime/artifact-loader")
export class ArtifactLoaderController{

 constructor(private readonly service:ArtifactLoaderService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
