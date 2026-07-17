import { Controller, Get } from '@nestjs/common';
import { LivingBlueprintSynchronizerService } from './living-blueprint-synchronizer.service';

@Controller('avos/future/architecture-intelligence/living-blueprint-synchronizer')
export class LivingBlueprintSynchronizerController {
  constructor(private readonly service: LivingBlueprintSynchronizerService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}