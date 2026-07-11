import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateRuntimeChangeExecutionDto,
  ExecuteRuntimeChangeDto,
  GovernanceActorDto,
} from "../dto";
import {
  RuntimeChangeExecutionService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/change-executions",
)
export class RuntimeChangeExecutionController {
  constructor(
    private readonly executions:
      RuntimeChangeExecutionService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateRuntimeChangeExecutionDto,
  ) {
    return this.executions.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.executions.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.executions.get(id);
  }

  @Post(":id/validate")
  validate(
    @Param("id")
    id: string,
    @Body()
    actor:
      GovernanceActorDto,
  ) {
    return this.executions
      .validate(id, actor);
  }

  @Post(":id/execute")
  execute(
    @Param("id")
    id: string,
    @Body()
    dto:
      ExecuteRuntimeChangeDto,
  ) {
    return this.executions
      .execute(id, dto);
  }
}
