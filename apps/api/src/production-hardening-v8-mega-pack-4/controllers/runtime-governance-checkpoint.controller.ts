import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateGovernanceCheckpointDto,
} from "../dto";
import {
  RuntimeGovernanceCheckpointService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/checkpoints",
)
export class RuntimeGovernanceCheckpointController {
  constructor(
    private readonly checkpoints:
      RuntimeGovernanceCheckpointService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateGovernanceCheckpointDto,
  ) {
    return this.checkpoints.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.checkpoints.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.checkpoints.get(id);
  }

  @Post(":id/verify")
  verify(
    @Param("id")
    id: string,
  ) {
    return this.checkpoints.verify(
      id,
    );
  }

  @Post(":id/restore-ready")
  restoreReady(
    @Param("id")
    id: string,
  ) {
    return this.checkpoints
      .markRestoreReady(id);
  }
}
