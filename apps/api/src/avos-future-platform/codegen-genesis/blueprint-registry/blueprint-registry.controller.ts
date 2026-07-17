import { Controller, Get } from '@nestjs/common';
import { BlueprintRegistryService } from './blueprint-registry.service';

@Controller('avos/future/codegen-genesis/blueprint-registry')
export class BlueprintRegistryController {
  constructor(private readonly service: BlueprintRegistryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}