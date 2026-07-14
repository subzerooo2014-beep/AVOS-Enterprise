import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Sse,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { SuperAppV2EventBusService } from "./super-app-v2.event-bus.service";
import { SuperAppV2ParallelRuntimeService } from "./super-app-v2.parallel-runtime.service";

@Controller("super-app-v2")
export class SuperAppV2Controller {
  constructor(
    private readonly runtime: SuperAppV2ParallelRuntimeService,
    private readonly eventBus: SuperAppV2EventBusService,
  ) {}

  @Post("execute")
  execute(
    @Body()
    body: {
      userId?: string;
      intent?: string;
    },
  ) {
    return this.runtime.execute(
      body?.userId || "demo-user",
      body?.intent || "Buy a trusted family SUV",
    );
  }

  @Get("workflows")
  listWorkflows() {
    return this.runtime.list();
  }

  @Get("workflows/:id")
  getWorkflow(@Param("id") id: string) {
    return this.runtime.get(id);
  }

  @Get("workflows/:id/events")
  getEvents(@Param("id") id: string) {
    return this.eventBus.list(id);
  }

  @Get("operations/metrics")
  metrics() {
    return this.runtime.metrics();
  }

  @Sse("events/:workflowId")
  stream(
    @Param("workflowId") workflowId: string,
  ): Observable<MessageEvent> {
    return this.eventBus.stream(workflowId).pipe(
      map((event) => ({
        data: event,
        type: event.type,
        id: event.id,
      })),
    );
  }

  @Post("smoke")
  async smoke() {
    const workflow = await this.runtime.execute(
      "smoke-user",
      "Buy a trusted Land Cruiser with finance and insurance",
    );

    const events = this.eventBus.list(workflow.id);
    const metrics = this.runtime.metrics();

    return {
      success:
        workflow.status === "COMPLETED" &&
        workflow.results.length === 7 &&
        events.length >= 16,
      system: "AVOS Super App Phase 2",
      integrationStatus: "running",
      workflowStatus: workflow.status,
      completedAgents: workflow.results.filter((result) => result.success)
        .length,
      events: events.length,
      overallScore: workflow.overallScore,
      activeWorkflows: metrics.activeWorkflows,
      completedWorkflows: metrics.completedWorkflows,
      capabilities: 6,
    };
  }
}