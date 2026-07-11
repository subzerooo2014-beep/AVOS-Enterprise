import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateGovernanceRestorePlanDto,
  ExecuteGovernanceRestorePlanDto,
} from "../dto";
import {
  RuntimeGovernanceRestoreService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/restores",
)
export class RuntimeGovernanceRestoreController {
  constructor(
    private readonly restores:
      RuntimeGovernanceRestoreService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateGovernanceRestorePlanDto,
  ) {
    return this.restores.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.restores.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.restores.get(id);
  }

  @Post(":id/validate")
  validate(
    @Param("id")
    id: string,
  ) {
    return this.restores.validate(
      id,
    );
  }

  @Post(":id/execute")
  execute(
    @Param("id")
    id: string,
    @Body()
    dto:
      ExecuteGovernanceRestorePlanDto,
  ) {
    return this.restores.execute(
      id,
      dto,
    );
  }
}
