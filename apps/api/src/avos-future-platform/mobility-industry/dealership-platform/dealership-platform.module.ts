import { Module } from '@nestjs/common';
import { DealershipPlatformController } from './dealership-platform.controller';
import { DealershipPlatformService } from './dealership-platform.service';

@Module({
  controllers: [DealershipPlatformController],
  providers: [DealershipPlatformService],
  exports: [DealershipPlatformService],
})
export class DealershipPlatformModule {}