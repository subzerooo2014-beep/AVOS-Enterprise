import { Controller, Get } from '@nestjs/common';
import { ProductionHardeningHealthService } from './health/production-hardening-health.service';
import { ProductionRuntimeRegistryService } from './runtime/production-runtime-registry.service';

@Controller('avos/ultimate-ecosystem-v3/production-hardening')
export class ProductionHardeningController {
  constructor(
    private readonly healthService: ProductionHardeningHealthService,
    private readonly runtimeRegistry: ProductionRuntimeRegistryService,
  ) {}

  @Get('status')
  getStatus() {
    return {
      ...this.healthService.getHealth(),
      runtime: this.runtimeRegistry.getStatus(),
    };
  }
}