import { Controller, Get } from '@nestjs/common';
import { GovernanceCertificationCenterService } from './governance-certification-center.service';

@Controller('avos/future/trust-governance/governance-certification-center')
export class GovernanceCertificationCenterController {
  constructor(private readonly service: GovernanceCertificationCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}