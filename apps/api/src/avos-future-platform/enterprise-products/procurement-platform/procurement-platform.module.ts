import { Module } from '@nestjs/common';
import { ProcurementPlatformController } from './procurement-platform.controller';
import { ProcurementPlatformService } from './procurement-platform.service';

@Module({
  controllers: [ProcurementPlatformController],
  providers: [ProcurementPlatformService],
  exports: [ProcurementPlatformService],
})
export class ProcurementPlatformModule {}