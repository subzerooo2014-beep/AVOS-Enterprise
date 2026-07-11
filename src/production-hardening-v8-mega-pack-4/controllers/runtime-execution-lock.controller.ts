import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  AcquireRuntimeLockDto,
  ReleaseRuntimeLockDto,
} from "../dto";
import {
  RuntimeExecutionLockService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/execution-locks",
)
export class RuntimeExecutionLockController {
  constructor(
    private readonly locks:
      RuntimeExecutionLockService,
  ) {}

  @Post()
  acquire(
    @Body()
    dto:
      AcquireRuntimeLockDto,
  ) {
    return this.locks.acquire(dto);
  }

  @Get()
  list() {
    return this.locks.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.locks.get(id);
  }

  @Post(":id/release")
  release(
    @Param("id")
    id: string,
    @Body()
    dto:
      ReleaseRuntimeLockDto,
  ) {
    return this.locks.release(
      id,
      dto,
    );
  }

  @Post(":id/force-release")
  forceRelease(
    @Param("id")
    id: string,
    @Body()
    dto:
      ReleaseRuntimeLockDto,
  ) {
    return this.locks
      .forceRelease(id, dto);
  }
}
