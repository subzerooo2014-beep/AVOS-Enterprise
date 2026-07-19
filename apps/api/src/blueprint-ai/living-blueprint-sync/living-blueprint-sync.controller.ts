import { Body, Controller, Post } from "@nestjs/common";
import { LivingBlueprintSyncService } from "./living-blueprint-sync.service";

@Controller("living-blueprint-sync")
export class LivingBlueprintSyncController {

  constructor(
    private readonly service:LivingBlueprintSyncService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
