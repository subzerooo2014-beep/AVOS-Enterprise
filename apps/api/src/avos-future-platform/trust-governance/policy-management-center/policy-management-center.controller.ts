import { Controller, Get } from '@nestjs/common';
import { PolicyManagementCenterService } from './policy-management-center.service';

@Controller('avos/future/trust-governance/policy-management-center')
export class PolicyManagementCenterController {
  constructor(private readonly service: PolicyManagementCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}