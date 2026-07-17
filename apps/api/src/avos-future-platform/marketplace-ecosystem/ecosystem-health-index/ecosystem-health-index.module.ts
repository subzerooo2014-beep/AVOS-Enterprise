import { Module } from '@nestjs/common';
import { EcosystemHealthIndexController } from './ecosystem-health-index.controller';
import { EcosystemHealthIndexService } from './ecosystem-health-index.service';

@Module({
  controllers: [EcosystemHealthIndexController],
  providers: [EcosystemHealthIndexService],
  exports: [EcosystemHealthIndexService],
})
export class EcosystemHealthIndexModule {}