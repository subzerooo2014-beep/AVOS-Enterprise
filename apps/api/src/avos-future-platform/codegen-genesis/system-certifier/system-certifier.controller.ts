import { Controller, Get } from '@nestjs/common';
import { SystemCertifierService } from './system-certifier.service';

@Controller('avos/future/codegen-genesis/system-certifier')
export class SystemCertifierController {
  constructor(private readonly service: SystemCertifierService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}