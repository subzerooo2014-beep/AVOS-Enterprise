import { Controller, Get } from '@nestjs/common';
import { NetworkEffectEngineService } from './network-effect-engine.service';

@Controller('avos/future/marketplace-ecosystem/network-effect-engine')
export class NetworkEffectEngineController {
  constructor(private readonly service: NetworkEffectEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}