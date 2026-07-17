import { Controller, Get } from '@nestjs/common';
import { PartnerCertificationService } from './partner-certification.service';

@Controller('avos/future/global-platform/partner-certification')
export class PartnerCertificationController {
  constructor(private readonly service: PartnerCertificationService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}