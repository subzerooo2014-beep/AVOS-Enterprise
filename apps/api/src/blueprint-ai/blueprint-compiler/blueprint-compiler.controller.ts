import { Body, Controller, Post } from "@nestjs/common";
import { BlueprintCompilerService } from "./blueprint-compiler.service";

@Controller("blueprint-compiler")
export class BlueprintCompilerController {

  constructor(
    private readonly service:BlueprintCompilerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
