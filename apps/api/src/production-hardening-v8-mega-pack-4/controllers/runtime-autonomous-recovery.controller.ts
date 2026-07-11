import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  ApproveRecoveryPlanDto,
  CreateRecoveryPlanDto,
  ExecuteRecoveryPlanDto,
  GovernanceActorDto,
} from "../dto";
import {
  RuntimeAutonomousRecoveryService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/recovery-plans",
)
export class RuntimeAutonomousRecoveryController {
  constructor(
    private readonly recovery:
      RuntimeAutonomousRecoveryService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateRecoveryPlanDto,
  ) {
    return this.recovery.create(dto);
  }

  @Get()
  list() {
    return this.recovery.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.recovery.get(id);
  }

  @Post(":id/approve")
  approve(
    @Param("id")
    id: string,
    @Body()
    dto: ApproveRecoveryPlanDto,
  ) {
    return this.recovery.approve(
      id,
      dto,
    );
  }

  @Post(":id/execute")
  execute(
    @Param("id")
    id: string,
    @Body()
    dto: ExecuteRecoveryPlanDto,
  ) {
    return this.recovery.execute(
      id,
      dto,
    );
  }

  @Post(":id/rollback")
  rollback(
    @Param("id")
    id: string,
    @Body()
    actor: GovernanceActorDto,
  ) {
    return this.recovery.rollback(
      id,
      actor,
    );
  }
}
