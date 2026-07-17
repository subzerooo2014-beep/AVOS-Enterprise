import { Module } from '@nestjs/common';
import { CrmPlatformController } from './crm-platform.controller';
import { CrmPlatformService } from './crm-platform.service';

@Module({
  controllers: [CrmPlatformController],
  providers: [CrmPlatformService],
  exports: [CrmPlatformService],
})
export class CrmPlatformModule {}