import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateGovernanceNotificationDto,
  GovernanceActorDto,
} from "../dto";
import {
  RuntimeGovernanceNotificationService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/notifications",
)
export class RuntimeGovernanceNotificationController {
  constructor(
    private readonly notifications:
      RuntimeGovernanceNotificationService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateGovernanceNotificationDto,
  ) {
    return this.notifications
      .create(dto);
  }

  @Get()
  list() {
    return this.notifications.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.notifications.get(id);
  }

  @Post(":id/send")
  send(
    @Param("id")
    id: string,
    @Body()
    actor:
      GovernanceActorDto,
  ) {
    return this.notifications.send(
      id,
      actor,
    );
  }

  @Post(":id/delivered")
  delivered(
    @Param("id")
    id: string,
  ) {
    return this.notifications
      .markDelivered(id);
  }
}
