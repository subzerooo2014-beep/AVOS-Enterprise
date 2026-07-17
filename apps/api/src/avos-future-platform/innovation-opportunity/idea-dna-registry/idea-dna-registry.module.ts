import { Module } from '@nestjs/common';
import { IdeaDnaRegistryController } from './idea-dna-registry.controller';
import { IdeaDnaRegistryService } from './idea-dna-registry.service';

@Module({
  controllers: [IdeaDnaRegistryController],
  providers: [IdeaDnaRegistryService],
  exports: [IdeaDnaRegistryService],
})
export class IdeaDnaRegistryModule {}