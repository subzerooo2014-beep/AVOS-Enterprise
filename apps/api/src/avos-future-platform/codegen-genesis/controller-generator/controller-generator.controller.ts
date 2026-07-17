import { Controller, Get } from '@nestjs/common';
import { ControllerGeneratorService } from './controller-generator.service';

@Controller('avos/future/codegen-genesis/controller-generator')
export class ControllerGeneratorController {
  constructor(private readonly service: ControllerGeneratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}