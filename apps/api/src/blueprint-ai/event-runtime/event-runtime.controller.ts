import { Body, Controller, Post } from "@nestjs/common";
import { EventRuntimeService } from "./event-runtime.service";

@Controller("event-runtime")
export class EventRuntimeController {

  constructor(
    private readonly service:EventRuntimeService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
