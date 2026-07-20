import { Module } from '@nestjs/common';
import { Pack1Module } from '../avos-platform-closure-pack-1/pack-1.module';
import { Pack2Module } from '../avos-platform-closure-pack-2/pack-2.module';
import { Pack3Module } from '../avos-platform-closure-pack-3/pack-3.module';
import { Pack4Module } from '../avos-platform-closure-pack-4/pack-4.module';
import { Pack5Module } from '../avos-platform-closure-pack-5/pack-5.module';
import { PlatformCertificationService } from './platform-certification.service';
import { PlatformClosureReviewService } from './platform-closure-review.service';
import { Pack6Controller } from './pack-6.controller';
import { Pack6Service } from './pack-6.service';
import { ProductionReadinessService } from './production-readiness.service';

@Module({
  imports: [
    Pack1Module,
    Pack2Module,
    Pack3Module,
    Pack4Module,
    Pack5Module,
  ],
  controllers: [Pack6Controller],
  providers: [
    PlatformClosureReviewService,
    ProductionReadinessService,
    PlatformCertificationService,
    Pack6Service,
  ],
  exports: [
    PlatformClosureReviewService,
    ProductionReadinessService,
    PlatformCertificationService,
    Pack6Service,
  ],
})
export class Pack6Module {}