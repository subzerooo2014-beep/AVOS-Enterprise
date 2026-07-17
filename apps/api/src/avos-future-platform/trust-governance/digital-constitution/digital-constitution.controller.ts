import { Controller, Get } from '@nestjs/common';
import { DigitalConstitutionService } from './digital-constitution.service';

@Controller('avos/future/trust-governance/digital-constitution')
export class DigitalConstitutionController {
  constructor(private readonly service: DigitalConstitutionService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}