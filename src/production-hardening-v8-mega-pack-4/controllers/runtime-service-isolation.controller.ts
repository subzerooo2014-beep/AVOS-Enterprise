import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateIsolationPlanDto,
  UpdateIsolationPlanStatusDto,
} from "../dto";
import {
  RuntimeServiceIsolationService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/isolation-plans",
)
export class RuntimeServiceIsolationController {
  constructor(
    private readonly isolation:
      RuntimeServiceIsolationService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateIsolationPlanDto,
  ) {
    return this.isolation.create(dto);
  }

  @Get()
  list() {
    return this.isolation.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.isolation.get(id);
  }

  @Post(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateIsolationPlanStatusDto,
  ) {
    return this.isolation
      .updateStatus(id, dto);
  }
}
