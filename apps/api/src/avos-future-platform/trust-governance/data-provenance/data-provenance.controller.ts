import { Controller, Get } from '@nestjs/common';
import { DataProvenanceService } from './data-provenance.service';

@Controller('avos/future/trust-governance/data-provenance')
export class DataProvenanceController {
  constructor(private readonly service: DataProvenanceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}