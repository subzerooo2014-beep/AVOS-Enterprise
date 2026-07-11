import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ComplianceBaselineService } from "./compliance-baseline.service";
import { ActorDto } from "./dto/actor.dto";
import { CompareBaselineDto } from "./dto/compare-baseline.dto";
import { CreateComplianceBaselineDto } from "./dto/create-compliance-baseline.dto";
import { UpdateBaselineStatusDto } from "./dto/update-baseline-status.dto";
import {
  BaselineStatus,
} from "./types/mega-pack-6.types";

@Controller(
  "production-hardening-v7/mega-pack-6/baselines",
)
export class ComplianceBaselineController {
  constructor(
    private readonly baselines:
      ComplianceBaselineService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateComplianceBaselineDto,
  ) {
    return this.baselines.create(dto);
  }

  @Get()
  list(
    @Query("status")
    status?: BaselineStatus,
  ) {
    return this.baselines.list(status);
  }

  @Get("comparisons")
  listComparisons(
    @Query("baselineId")
    baselineId?: string,
  ) {
    return this.baselines.listComparisons(
      baselineId,
    );
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.baselines.get(id);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto:
      UpdateBaselineStatusDto &
      ActorDto,
  ) {
    return this.baselines.updateStatus(
      id,
      dto.status,
      dto.actor ?? "api",
    );
  }

  @Post(":id/compare")
  compare(
    @Param("id")
    id: string,
    @Body()
    dto: CompareBaselineDto,
  ) {
    return this.baselines.compare(
      id,
      dto,
    );
  }
}
