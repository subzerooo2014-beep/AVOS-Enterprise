import { Module } from '@nestjs/common';
import { InsurancePlatformController } from './insurance-platform.controller';
import { InsurancePlatformService } from './insurance-platform.service';

@Module({
  controllers: [InsurancePlatformController],
  providers: [InsurancePlatformService],
  exports: [InsurancePlatformService],
})
export class InsurancePlatformModule {}