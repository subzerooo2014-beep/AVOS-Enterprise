import { Controller, Get } from '@nestjs/common';
import { EnterpriseAppStoreService } from './enterprise-app-store.service';

@Controller('avos/future/marketplace-ecosystem/enterprise-app-store')
export class EnterpriseAppStoreController {
  constructor(private readonly service: EnterpriseAppStoreService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}