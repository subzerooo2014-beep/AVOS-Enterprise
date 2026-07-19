import { Body, Controller, Post } from "@nestjs/common";
import { TypeScriptFileWriterService } from "./typescript-file-writer.service";

@Controller("generated-project")
export class GeneratedProjectController{

 constructor(
   private readonly writer:TypeScriptFileWriterService
 ){}

 @Post("write")
 write(@Body() body:{project:string}){
   return this.writer.writeModule(body.project);
 }

}
