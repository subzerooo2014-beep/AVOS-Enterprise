import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CertificationWorkflowState } from "./omega-workflow.types";
import { OmegaWorkflowFacadeService } from "./omega-workflow-facade.service";

@Controller("inspection-certification/omega/workflow")
export class OmegaWorkflowController {
  constructor(
    private readonly facade: OmegaWorkflowFacadeService,
  ) {}

  @Get("status")
  status() {
    return this.facade.status();
  }

  @Post("demo")
  createDemo() {
    return this.facade.createDemo();
  }

  @Post("approve-certify")
  approveAndCertify(
    @Body()
    body: {
      readonly workflowId: string;
      readonly approvalId: string;
      readonly decidedBy?: string;
      readonly reason?: string;
    },
  ) {
    return this.facade.approveAndCertify(body);
  }

  @Get("registry")
  registry() {
    return this.facade.registry();
  }

  @Get("transitions/:state")
  transitions(
    @Param("state") state: CertificationWorkflowState,
  ) {
    return this.facade.allowedTransitions(state);
  }

  @Get("lifecycle/:workflowId")
  lifecycle(@Param("workflowId") workflowId: string) {
    return this.facade.lifecycleHistory(workflowId);
  }
}
