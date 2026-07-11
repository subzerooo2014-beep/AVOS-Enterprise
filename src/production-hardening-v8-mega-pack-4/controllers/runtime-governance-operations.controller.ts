import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "@nestjs/common";
import {
  CreateGovernanceTimelineEventDto,
} from "../dto";
import {
  RuntimeGovernanceOperationsStatusService,
  RuntimeGovernanceTimelineService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/operations",
)
export class RuntimeGovernanceOperationsController {
  constructor(
    private readonly timeline:
      RuntimeGovernanceTimelineService,
    private readonly status:
      RuntimeGovernanceOperationsStatusService,
  ) {}

  @Post("timeline")
  appendTimeline(
    @Body()
    dto:
      CreateGovernanceTimelineEventDto,
  ) {
    return this.timeline.append(
      dto,
    );
  }

  @Get("timeline")
  listTimeline(
    @Query("aggregateType")
    aggregateType?: string,
    @Query("aggregateId")
    aggregateId?: string,
  ) {
    return this.timeline.list({
      aggregateType,
      aggregateId,
    });
  }

  @Get("status")
  snapshot() {
    return this.status.snapshot();
  }
}
