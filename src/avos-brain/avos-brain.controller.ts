import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AvosBrainService } from "./avos-brain.service";

@Controller("avos-brain")
export class AvosBrainController {
  constructor(private service: AvosBrainService) {}

  @Post("process-event/:eventId")
  processEvent(@Param("eventId") eventId: string) {
    return this.service.processEvent(eventId);
  }

  @Post("process-latest")
  processLatest(@Body() body: any) {
    return this.service.processLatest(body.limit || 10);
  }

  @Get("tasks")
  listTasks(@Query("status") status?: string) {
    return this.service.listTasks(status);
  }

  @Patch("tasks/:id/complete")
  complete(@Param("id") id: string, @Body() body: any) {
    return this.service.completeTask(id, body);
  }
}
