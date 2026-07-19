import { Body, Controller, Post } from "@nestjs/common";
import { EntityGraphService } from "./entity-graph.service";

@Controller("entity-graph")
export class EntityGraphController {

  constructor(
    private readonly service:EntityGraphService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
