import { Controller, Get } from '@nestjs/common';
import { GenesisEngineService } from './genesis-engine.service';

@Controller('avos/future/codegen-genesis/genesis-engine')
export class GenesisEngineController {
  constructor(private readonly service: GenesisEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}