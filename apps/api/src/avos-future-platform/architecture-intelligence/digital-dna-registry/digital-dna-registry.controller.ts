import { Controller, Get } from '@nestjs/common';
import { DigitalDnaRegistryService } from './digital-dna-registry.service';

@Controller('avos/future/architecture-intelligence/digital-dna-registry')
export class DigitalDnaRegistryController {
  constructor(private readonly service: DigitalDnaRegistryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}