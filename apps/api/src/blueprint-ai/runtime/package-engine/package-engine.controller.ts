import { Body, Controller, Post } from "@nestjs/common";
import { PackageEngineService } from "./package-engine.service";

@Controller("runtime/package-engine")
export class PackageEngineController{

 constructor(private readonly service:PackageEngineService){}

 @Post("execute")
 execute(@Body() body:any){
   return this.service.execute(body);
 }

}
