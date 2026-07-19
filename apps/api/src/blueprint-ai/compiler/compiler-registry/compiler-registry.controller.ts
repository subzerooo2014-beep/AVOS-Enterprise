import { Body, Controller, Post } from "@nestjs/common";
import { CompilerRegistryService } from "./compiler-registry.service";

@Controller("compiler/compiler-registry")
export class CompilerRegistryController {

  constructor(
    private readonly service:CompilerRegistryService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
