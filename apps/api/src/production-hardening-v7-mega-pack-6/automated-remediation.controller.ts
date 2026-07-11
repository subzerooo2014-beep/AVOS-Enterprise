import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { AutomatedRemediationService } from "./automated-remediation.service";
import { ApprovalSubmitDto } from "./dto/approval-submit.dto";
import { CreateAutomatedRemediationDto } from "./dto/create-automated-remediation.dto";
import { ExecuteRemediationDto } from "./dto/execute-remediation.dto";

@Controller(
  "production-hardening-v7/mega-pack-6/remediations",
)
export class AutomatedRemediationController {
  constructor(
    private readonly remediations:
      AutomatedRemediationService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateAutomatedRemediationDto,
  ) {
    return this.remediations.create(
      dto,
    );
  }

  @Get()
  list() {
    return this.remediations.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.remediations.get(id);
  }

  @Post(":id/request-approval")
  requestApproval(
    @Param("id")
    id: string,
    @Body()
    dto: ApprovalSubmitDto,
  ) {
    return this.remediations
      .requestApproval(
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
    return this.remediations
      .synchronizeApproval(id);
  }

  @Post(":id/execute")
  execute(
    @Param("id")
    id: string,
    @Body()
    dto: ExecuteRemediationDto,
  ) {
    return this.remediations.execute(
      id,
      dto,
    );
  }
}
