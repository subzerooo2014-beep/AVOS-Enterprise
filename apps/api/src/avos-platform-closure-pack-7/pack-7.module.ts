import { Module } from '@nestjs/common';
import { CognitiveGovernanceModule } from '../avos-platform-closure-pack-0-5/cognitive-governance.module';
import { Pack6Module } from '../avos-platform-closure-pack-6/pack-6.module';
import { EvolutionGovernanceService } from './evolution-governance.service';
import { EvolutionImpactService } from './evolution-impact.service';
import { Pack7Controller } from './pack-7.controller';
import { Pack7Service } from './pack-7.service';

@Module({
  imports: [
    CognitiveGovernanceModule,
    Pack6Module,
  ],
  controllers: [Pack7Controller],
  providers: [
    EvolutionImpactService,
    EvolutionGovernanceService,
    Pack7Service,
  ],
  exports: [
    EvolutionImpactService,
    EvolutionGovernanceService,
    Pack7Service,
  ],
})
export class Pack7Module {}