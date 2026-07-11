import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

import { AiCampaignLaunchService } from "./ai-campaign-launch.service";

@Controller(
  "ai-campaign-manager/launch",
)
export class AiCampaignLaunchController {
  constructor(
    private readonly service:
      AiCampaignLaunchService,
  ) {}

  @Post("validate/:eventId")
  validate(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      channels?: string[];
    },
  ) {
    return this.service.validate(
      eventId,
      body?.channels,
    );
  }

  @Post("execute/:eventId")
  launch(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      launchedBy?: string;
      dispatchImmediately?: boolean;
      channels?: string[];
    },
  ) {
    return this.service.launch(
      eventId,
      body,
    );
  }

  @Post("retry-failed/:eventId")
  retryFailed(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      launchedBy?: string;
    },
  ) {
    return this.service.retryFailed(
      eventId,
      body?.launchedBy,
    );
  }

  @Get("summary/:eventId")
  summary(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.launchSummary(
      eventId,
    );
  }

  @Get("progress/:eventId")
  progress(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.progress(
      eventId,
    );
  }
}
