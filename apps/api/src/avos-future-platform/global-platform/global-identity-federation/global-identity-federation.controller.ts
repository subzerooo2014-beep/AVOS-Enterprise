import { Controller, Get } from '@nestjs/common';
import { GlobalIdentityFederationService } from './global-identity-federation.service';

@Controller('avos/future/global-platform/global-identity-federation')
export class GlobalIdentityFederationController {
  constructor(private readonly service: GlobalIdentityFederationService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}