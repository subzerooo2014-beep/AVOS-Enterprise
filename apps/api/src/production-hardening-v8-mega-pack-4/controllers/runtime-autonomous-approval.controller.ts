import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  RuntimeAutonomousApprovalService,
  RuntimeGovernanceRequestService,
} from "../services";

@Controller(
  "production-hardening-v8-mega-pack-4/approval-suggestions",
)
export class RuntimeAutonomousApprovalController {
  constructor(
    private readonly approvals:
      RuntimeAutonomousApprovalService,
    private readonly requests:
      RuntimeGovernanceRequestService,
  ) {}

  @Post("requests/:requestId")
  generate(
    @Param("requestId")
    requestId: string,
    @Body()
    runtimeContext:
      Record<string, unknown>,
  ) {
    const request =
      this.requests.get(
        requestId,
      );

    return this.approvals.generate(
      request,
      runtimeContext ?? {},
    );
  }

  @Get()
  list() {
    return this.approvals.list();
  }
}
