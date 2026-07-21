import { Module } from '@nestjs/common';
import { SoftwareDevelopmentOsProductionController } from './software-development-os-production.controller';
import { SoftwareDevelopmentOsProductionService } from './software-development-os-production.service';

@Module({
  controllers: [SoftwareDevelopmentOsProductionController],
  providers: [SoftwareDevelopmentOsProductionService],
  exports: [SoftwareDevelopmentOsProductionService],
})
export class SoftwareDevelopmentOsProductionModule {}
