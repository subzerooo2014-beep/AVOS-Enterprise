import { Controller, Get } from '@nestjs/common';
import { IdeaDnaRegistryService } from './idea-dna-registry.service';

@Controller('avos/future/innovation-opportunity/idea-dna-registry')
export class IdeaDnaRegistryController {
  constructor(private readonly service: IdeaDnaRegistryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}