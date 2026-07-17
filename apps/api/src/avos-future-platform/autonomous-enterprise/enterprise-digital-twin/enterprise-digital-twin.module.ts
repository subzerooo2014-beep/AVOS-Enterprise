import { Module } from '@nestjs/common';
import { EnterpriseDigitalTwinController } from './enterprise-digital-twin.controller';
import { EnterpriseDigitalTwinService } from './enterprise-digital-twin.service';

@Module({
  controllers: [EnterpriseDigitalTwinController],
  providers: [EnterpriseDigitalTwinService],
  exports: [EnterpriseDigitalTwinService],
})
export class EnterpriseDigitalTwinModule {}