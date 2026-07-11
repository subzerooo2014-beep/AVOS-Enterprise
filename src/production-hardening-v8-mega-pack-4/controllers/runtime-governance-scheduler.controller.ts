import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateGovernanceScheduleDto,
  GovernanceActorDto,
  UpdateGovernanceScheduleStatusDto,
} from "../dto";
import {
  RuntimeGovernanceSchedulerService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/schedules",
)
export class RuntimeGovernanceSchedulerController {
  constructor(
    private readonly schedules:
      RuntimeGovernanceSchedulerService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateGovernanceScheduleDto,
  ) {
    return this.schedules.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.schedules.list();
  }

  @Get("runs")
  listRuns() {
    return this.schedules
      .listRuns();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.schedules.get(id);
  }

  @Post(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateGovernanceScheduleStatusDto,
  ) {
    return this.schedules
      .updateStatus(id, dto);
  }

  @Post("run-due")
  runDue(
    @Body()
    actor:
      GovernanceActorDto,
  ) {
    return this.schedules
      .runDue(actor);
  }
}
