import { Body, Controller, Post } from "@nestjs/common";
import { IncrementalCompilerService } from "./incremental-compiler.service";

@Controller("compiler/incremental-compiler")
export class IncrementalCompilerController {

  constructor(
    private readonly service:IncrementalCompilerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
