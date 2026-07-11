import { Body, Controller, Get, Post } from "@nestjs/common";
import { AiCoreService } from "./ai-core.service";

@Controller("ai-core")
export class AiCoreController {
  constructor(private service: AiCoreService) {}

  @Post("agents")
  createAgent(@Body() body: any) {
    return this.service.createAgent(body);
  }

  @Get("agents")
  listAgents() {
    return this.service.listAgents();
  }

  @Post("events")
  createEvent(@Body() body: any) {
    return this.service.createEvent(body);
  }

  @Get("events")
  listEvents() {
    return this.service.listEvents();
  }

  @Post("explain")
  explain(@Body() body: any) {
    return this.service.explainDecision(body);
  }
}
