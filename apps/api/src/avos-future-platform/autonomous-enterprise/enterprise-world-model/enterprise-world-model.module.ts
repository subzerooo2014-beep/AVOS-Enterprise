import { Module } from '@nestjs/common';
import { EnterpriseWorldModelController } from './enterprise-world-model.controller';
import { EnterpriseWorldModelService } from './enterprise-world-model.service';

@Module({
  controllers: [EnterpriseWorldModelController],
  providers: [EnterpriseWorldModelService],
  exports: [EnterpriseWorldModelService],
})
export class EnterpriseWorldModelModule {}