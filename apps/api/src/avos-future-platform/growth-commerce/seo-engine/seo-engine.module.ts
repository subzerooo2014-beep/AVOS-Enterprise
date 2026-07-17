import { Module } from '@nestjs/common';
import { SeoEngineController } from './seo-engine.controller';
import { SeoEngineService } from './seo-engine.service';

@Module({
  controllers: [SeoEngineController],
  providers: [SeoEngineService],
  exports: [SeoEngineService],
})
export class SeoEngineModule {}