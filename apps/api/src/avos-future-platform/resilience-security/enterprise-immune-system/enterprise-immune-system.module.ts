import { Module } from '@nestjs/common';
import { EnterpriseImmuneSystemController } from './enterprise-immune-system.controller';
import { EnterpriseImmuneSystemService } from './enterprise-immune-system.service';

@Module({
  controllers: [EnterpriseImmuneSystemController],
  providers: [EnterpriseImmuneSystemService],
  exports: [EnterpriseImmuneSystemService],
})
export class EnterpriseImmuneSystemModule {}