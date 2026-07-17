import { Controller, Get } from '@nestjs/common';
import { SelfDiagnosisEngineService } from './self-diagnosis-engine.service';

@Controller('avos/future/resilience-security/self-diagnosis-engine')
export class SelfDiagnosisEngineController {
  constructor(private readonly service: SelfDiagnosisEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}