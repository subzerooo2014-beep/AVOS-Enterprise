import { Module } from '@nestjs/common';
import { BlueprintRegistryController } from './blueprint-registry.controller';
import { BlueprintRegistryService } from './blueprint-registry.service';

@Module({
  controllers: [BlueprintRegistryController],
  providers: [BlueprintRegistryService],
  exports: [BlueprintRegistryService],
})
export class BlueprintRegistryModule {}