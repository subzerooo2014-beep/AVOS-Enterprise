import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateGovernanceEscalationDto,
  GovernanceActorDto,
  UpdateGovernanceEscalationDto,
} from "../dto";
import {
  RuntimeGovernanceEscalationService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/escalations",
)
export class RuntimeGovernanceEscalationController {
  constructor(
    private readonly escalations:
      RuntimeGovernanceEscalationService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateGovernanceEscalationDto,
  ) {
    return this.escalations.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.escalations.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.escalations.get(id);
  }

  @Post(":id/update")
  update(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateGovernanceEscalationDto,
  ) {
    return this.escalations.update(
      id,
      dto,
    );
  }

  @Post(":id/notification")
  createNotification(
    @Param("id")
    id: string,
    @Body()
    actor:
      GovernanceActorDto,
  ) {
    return this.escalations
      .createNotification(
        id,
        actor,
      );
  }
}
