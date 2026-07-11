import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ControlSchedulerService } from "./control-scheduler.service";
import { CreateControlScheduleDto } from "./dto/create-control-schedule.dto";
import { SetEnabledDto } from "./dto/set-enabled.dto";

@Controller(
  "production-hardening-v7/mega-pack-6/scheduler",
)
export class ControlSchedulerController {
  constructor(
    private readonly scheduler:
      ControlSchedulerService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateControlScheduleDto,
  ) {
    return this.scheduler.create(dto);
  }

  @Get()
  list() {
    return this.scheduler.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.scheduler.get(id);
  }

  @Post("run-due")
  runDue() {
    return this.scheduler.runDue();
  }

  @Post(":id/run")
  runNow(
    @Param("id")
    id: string,
  ) {
    return this.scheduler.runNow(id);
  }

  @Patch(":id/enabled")
  setEnabled(
    @Param("id")
    id: string,
    @Body()
    dto: SetEnabledDto,
  ) {
    return this.scheduler.enable(
      id,
      dto.enabled,
    );
  }
}
