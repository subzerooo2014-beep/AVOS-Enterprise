import { Controller, Get } from '@nestjs/common';
import { ModuleGeneratorService } from './module-generator.service';

@Controller('avos/future/codegen-genesis/module-generator')
export class ModuleGeneratorController {
  constructor(private readonly service: ModuleGeneratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}