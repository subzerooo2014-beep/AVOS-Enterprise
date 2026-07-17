import { Controller, Get } from '@nestjs/common';
import { HumanApprovalFrameworkService } from './human-approval-framework.service';

@Controller('avos/future/trust-governance/human-approval-framework')
export class HumanApprovalFrameworkController {
  constructor(private readonly service: HumanApprovalFrameworkService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}