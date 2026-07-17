import { Controller, Get } from '@nestjs/common';
import { ServiceGeneratorService } from './service-generator.service';

@Controller('avos/future/codegen-genesis/service-generator')
export class ServiceGeneratorController {
  constructor(private readonly service: ServiceGeneratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}