import { Controller, Get } from '@nestjs/common';
import { ContinuousOptimizationEngineService } from './continuous-optimization-engine.service';

@Controller('avos/future/autonomous-enterprise/continuous-optimization-engine')
export class ContinuousOptimizationEngineController {
  constructor(private readonly service: ContinuousOptimizationEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}