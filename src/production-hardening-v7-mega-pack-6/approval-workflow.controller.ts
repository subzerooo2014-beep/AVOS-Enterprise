import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApprovalWorkflowService } from "./approval-workflow.service";
import { ApprovalVoteDto } from "./dto/approval-vote.dto";
import { CreateApprovalRequestDto } from "./dto/create-approval-request.dto";
import {
  ApprovalDecision,
} from "./types/mega-pack-6.types";

@Controller(
  "production-hardening-v7/mega-pack-6/approvals",
)
export class ApprovalWorkflowController {
  constructor(
    private readonly approvals:
      ApprovalWorkflowService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateApprovalRequestDto,
  ) {
    return this.approvals.create(dto);
  }

  @Get()
  list(
    @Query("decision")
    decision?: ApprovalDecision,
  ) {
    return this.approvals.list(
      decision,
    );
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.approvals.get(id);
  }

  @Post(":id/vote")
  vote(
    @Param("id")
    id: string,
    @Body()
    dto: ApprovalVoteDto,
  ) {
    return this.approvals.vote(
      id,
      dto,
    );
  }

  @Patch(":id/cancel/:actor")
  cancel(
    @Param("id")
    id: string,
    @Param("actor")
    actor: string,
  ) {
    return this.approvals.cancel(
      id,
      actor,
    );
  }

  @Post("maintenance/expire")
  expirePending() {
    return this.approvals
      .expirePendingRequests();
  }
}
