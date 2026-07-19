import { Body, Controller, Post } from "@nestjs/common";
import { ArtifactCacheService } from "./artifact-cache.service";

@Controller("runtime/artifact-cache")
export class ArtifactCacheController{

 constructor(private readonly service:ArtifactCacheService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
