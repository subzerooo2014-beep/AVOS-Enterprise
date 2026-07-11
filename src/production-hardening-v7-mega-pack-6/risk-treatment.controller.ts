import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApprovalSubmitDto } from "./dto/approval-submit.dto";
import { CreateRiskTreatmentDto } from "./dto/create-risk-treatment.dto";
import { UpdateOperationalStatusDto } from "./dto/update-operational-status.dto";
import { UpdateRiskTreatmentStatusDto } from "./dto/update-risk-treatment-status.dto";
import { RiskTreatmentService } from "./risk-treatment.service";
import {
  RiskTreatmentStatus,
} from "./types/mega-pack-6.types";

@Controller(
  "production-hardening-v7/mega-pack-6/risk-treatments",
)
export class RiskTreatmentController {
  constructor(
    private readonly treatments:
      RiskTreatmentService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateRiskTreatmentDto,
  ) {
    return this.treatments.create(
      dto,
    );
  }

  @Get()
  list(
    @Query("status")
    status?: RiskTreatmentStatus,
  ) {
    return this.treatments.list(
      status,
    );
  }

  @Get("summary")
  summary() {
    return this.treatments.summary();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.treatments.get(id);
  }

  @Post(":id/submit-approval")
  submitApproval(
    @Param("id")
    id: string,
    @Body()
    dto: ApprovalSubmitDto,
  ) {
    return this.treatments
      .submitForApproval(
        id,
        dto.approvers,
        dto.minimumApprovals,
      );
  }

  @Post(":id/sync-approval")
  syncApproval(
    @Param("id")
    id: string,
  ) {
    return this.treatments
      .synchronizeApproval(id);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id")
    id: string,
    @Body()
    dto: UpdateRiskTreatmentStatusDto,
  ) {
    return this.treatments
      .updateStatus(
        id,
        dto.status,
      );
  }

  @Patch(
    ":planId/tasks/:taskId/status",
  )
  updateTaskStatus(
    @Param("planId")
    planId: string,
    @Param("taskId")
    taskId: string,
    @Body()
    dto: UpdateOperationalStatusDto,
  ) {
    return this.treatments
      .updateTaskStatus(
        planId,
        taskId,
        dto.status,
        dto.output,
      );
  }
}
