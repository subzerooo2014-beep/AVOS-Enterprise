import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { AiCampaignManagerService } from "./ai-campaign-manager.service";

@Controller(
  "ai-campaign-manager",
)
export class AiCampaignManagerController {
  constructor(
    private readonly service:
      AiCampaignManagerService,
  ) {}

  @Post("generate/:vehicleId")
  generate(
    @Param("vehicleId")
    vehicleId: string,

    @Body()
    body: any,
  ) {
    return this.service.generatePlan(
      vehicleId,
      body,
    );
  }

  @Post("generate-save/:vehicleId")
  generateAndSave(
    @Param("vehicleId")
    vehicleId: string,

    @Body()
    body: any,
  ) {
    return this.service.generateAndSave(
      vehicleId,
      body,
    );
  }

  @Get("history/:vehicleId")
  history(
    @Param("vehicleId")
    vehicleId: string,

    @Query("limit")
    limit?: string,
  ) {
    return this.service.history(
      vehicleId,
      limit
        ? Number(limit)
        : 20,
    );
  }

  @Get("plan/:eventId")
  plan(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.plan(
      eventId,
    );
  }

  @Get("lifecycle/:eventId")
  lifecycle(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.lifecycle(
      eventId,
    );
  }

  @Post("submit/:eventId")
  submit(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      note?: string;
    },
  ) {
    return this.service.submitForApproval(
      eventId,
      body?.note,
    );
  }

  @Post("approve/:eventId")
  approve(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      approvedBy?: string;
      note?: string;
    },
  ) {
    return this.service.approve(
      eventId,
      body,
    );
  }

  @Post("reject/:eventId")
  reject(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      rejectedBy?: string;
      reason?: string;
    },
  ) {
    return this.service.reject(
      eventId,
      body,
    );
  }

  @Post("cancel/:eventId")
  cancel(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      cancelledBy?: string;
      reason?: string;
    },
  ) {
    return this.service.cancel(
      eventId,
      body,
    );
  }
}
