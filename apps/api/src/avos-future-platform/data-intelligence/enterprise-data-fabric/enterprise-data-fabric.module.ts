import { Module } from '@nestjs/common';
import { EnterpriseDataFabricController } from './enterprise-data-fabric.controller';
import { EnterpriseDataFabricService } from './enterprise-data-fabric.service';

@Module({
  controllers: [EnterpriseDataFabricController],
  providers: [EnterpriseDataFabricService],
  exports: [EnterpriseDataFabricService],
})
export class EnterpriseDataFabricModule {}