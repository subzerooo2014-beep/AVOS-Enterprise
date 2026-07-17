import { Controller, Get } from '@nestjs/common';
import { ValueCreationEngineService } from './value-creation-engine.service';

@Controller('avos/future/innovation-opportunity/value-creation-engine')
export class ValueCreationEngineController {
  constructor(private readonly service: ValueCreationEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}