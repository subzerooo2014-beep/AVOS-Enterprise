import { Module } from '@nestjs/common';
import { UltimatePlatformController } from './ultimate-platform.controller';
import { UltimatePlatformRegistry } from './ultimate-platform.registry';
import { UltimatePlatformService } from './ultimate-platform.service';

@Module({
  controllers: [UltimatePlatformController],
  providers: [UltimatePlatformRegistry, UltimatePlatformService],
  exports: [UltimatePlatformRegistry, UltimatePlatformService],
})
export class UltimatePlatformV1Module {}