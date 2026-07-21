import { Module } from '@nestjs/common';
import { EnterpriseEvolutionController } from './enterprise-evolution.controller';
import { EnterpriseEvolutionRepository } from './enterprise-evolution.repository';
import { EnterpriseEvolutionService } from './enterprise-evolution.service';

@Module({
  controllers: [EnterpriseEvolutionController],
  providers: [EnterpriseEvolutionService, EnterpriseEvolutionRepository],
  exports: [EnterpriseEvolutionService],
})
export class EnterpriseEvolutionModule {}