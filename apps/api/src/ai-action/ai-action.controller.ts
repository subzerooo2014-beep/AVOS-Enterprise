import { Controller, Get, Param } from "@nestjs/common";
import { AiActionService } from "./ai-action.service";

@Controller("ai-action")
export class AiActionController {

  constructor(
    private readonly service:AiActionService,
  ){}

  @Get("vehicle/:id")
  execute(@Param("id") id:string){

    return this.service.execute(id);

  }

}
