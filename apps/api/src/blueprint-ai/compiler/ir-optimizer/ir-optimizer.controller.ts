import { Body, Controller, Post } from "@nestjs/common";
import { IrOptimizerService } from "./ir-optimizer.service";

@Controller("compiler/ir-optimizer")
export class IrOptimizerController {

  constructor(
    private readonly service:IrOptimizerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
