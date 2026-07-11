import { Controller, Get, Param } from "@nestjs/common";
import { AiActionLogService } from "./ai-action-log.service";

@Controller("ai-action-log")
export class AiActionLogController {
  constructor(private readonly service: AiActionLogService) {}

  @Get("vehicle/:id")
  history(@Param("id") id: string) {
    return this.service.history(id);
  }
}
