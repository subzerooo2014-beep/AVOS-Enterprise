import { Controller, Get } from '@nestjs/common';
import { TemplateEngineService } from './template-engine.service';

@Controller('avos/future/codegen-genesis/template-engine')
export class TemplateEngineController {
  constructor(private readonly service: TemplateEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}