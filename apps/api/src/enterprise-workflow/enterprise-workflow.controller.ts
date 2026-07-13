import { Body, Controller, Get, Post } from "@nestjs/common";

import { EnterpriseWorkflowService } from "./enterprise-workflow.service";

@Controller("enterprise-workflows")
export class EnterpriseWorkflowController {
  constructor(
    private readonly workflowService: EnterpriseWorkflowService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.workflowService.createWorkflow(body);
  }

  @Post("execute")
  execute(@Body() body: any) {
    return this.workflowService.executeWorkflow(body);
  }

  @Post("recover")
  recover(@Body() body: any) {
    return this.workflowService.recoverWorkflow(body);
  }

  @Get("status")
  status() {
    return this.workflowService.status();
  }
}
