import { Controller, Get } from '@nestjs/common';
import { ArchitecturePolicyValidatorService } from './architecture-policy-validator.service';

@Controller('avos/future/architecture-intelligence/architecture-policy-validator')
export class ArchitecturePolicyValidatorController {
  constructor(private readonly service: ArchitecturePolicyValidatorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}