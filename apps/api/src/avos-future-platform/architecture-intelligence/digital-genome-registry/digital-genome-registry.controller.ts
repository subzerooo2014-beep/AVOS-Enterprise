import { Controller, Get } from '@nestjs/common';
import { DigitalGenomeRegistryService } from './digital-genome-registry.service';

@Controller('avos/future/architecture-intelligence/digital-genome-registry')
export class DigitalGenomeRegistryController {
  constructor(private readonly service: DigitalGenomeRegistryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}