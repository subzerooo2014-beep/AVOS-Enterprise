import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateRuntimeRunbookDto,
  ExecuteRuntimeRunbookDto,
  UpdateRuntimeRunbookStatusDto,
} from "../dto";
import {
  RuntimeRunbookService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/runbooks",
)
export class RuntimeRunbookController {
  constructor(
    private readonly runbooks:
      RuntimeRunbookService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateRuntimeRunbookDto,
  ) {
    return this.runbooks.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.runbooks.list();
  }

  @Get("executions")
  listExecutions() {
    return this.runbooks
      .listExecutions();
  }

  @Get("executions/:id")
  getExecution(
    @Param("id")
    id: string,
  ) {
    return this.runbooks
      .getExecution(id);
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.runbooks.get(id);
  }

  @Post(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateRuntimeRunbookStatusDto,
  ) {
    return this.runbooks
      .updateStatus(id, dto);
  }

  @Post(":id/execute")
  execute(
    @Param("id")
    id: string,
    @Body()
    dto:
      ExecuteRuntimeRunbookDto,
  ) {
    return this.runbooks
      .execute(id, dto);
  }
}
