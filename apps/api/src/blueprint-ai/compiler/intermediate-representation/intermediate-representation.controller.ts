import { Body, Controller, Post } from "@nestjs/common";
import { IntermediateRepresentationService } from "./intermediate-representation.service";

@Controller("compiler/intermediate-representation")
export class IntermediateRepresentationController {

  constructor(
    private readonly service:IntermediateRepresentationService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
