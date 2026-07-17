import { Controller, Get } from '@nestjs/common';
import { ContinuousInnovationLabService } from './continuous-innovation-lab.service';

@Controller('avos/future/innovation-opportunity/continuous-innovation-lab')
export class ContinuousInnovationLabController {
  constructor(private readonly service: ContinuousInnovationLabService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}