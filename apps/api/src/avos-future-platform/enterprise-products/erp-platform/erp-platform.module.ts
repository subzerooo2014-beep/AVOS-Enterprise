import { Module } from '@nestjs/common';
import { ErpPlatformController } from './erp-platform.controller';
import { ErpPlatformService } from './erp-platform.service';

@Module({
  controllers: [ErpPlatformController],
  providers: [ErpPlatformService],
  exports: [ErpPlatformService],
})
export class ErpPlatformModule {}