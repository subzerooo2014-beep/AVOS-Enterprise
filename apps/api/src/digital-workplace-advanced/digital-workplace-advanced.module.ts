import { Module } from '@nestjs/common';
import { DigitalWorkplaceAdvancedController } from './digital-workplace-advanced.controller';
import { DigitalWorkplaceAdvancedService } from './digital-workplace-advanced.service';

@Module({
  controllers: [DigitalWorkplaceAdvancedController],
  providers: [DigitalWorkplaceAdvancedService],
  exports: [DigitalWorkplaceAdvancedService],
})
export class DigitalWorkplaceAdvancedModule {}