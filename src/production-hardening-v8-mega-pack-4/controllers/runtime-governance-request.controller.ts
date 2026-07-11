import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  CreateGovernanceRequestDto,
  GovernanceActorDto,
  RecordGovernanceApprovalDto,
} from "../dto";
import {
  RuntimeGovernanceRequestService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/requests",
)
export class RuntimeGovernanceRequestController {
  constructor(
    private readonly requests:
      RuntimeGovernanceRequestService,
  ) {}

  @Post()
  create(
    @Body()
    dto:
      CreateGovernanceRequestDto,
  ) {
    return this.requests.create(dto);
  }

  @Get()
  list() {
    return this.requests.list();
  }

  @Get(":id")
  get(
    @Param("id")
    id: string,
  ) {
    return this.requests.get(id);
  }

  @Post(":id/approval")
  recordApproval(
    @Param("id")
    id: string,
    @Body()
    dto:
      RecordGovernanceApprovalDto,
  ) {
    return this.requests
      .recordApproval(id, dto);
  }

  @Post(":id/execute")
  execute(
    @Param("id")
    id: string,
    @Body()
    actor:
      GovernanceActorDto,
  ) {
    return this.requests
      .markExecuted(id, actor);
  }
}
