import { Module } from '@nestjs/common';
import { DigitalGenomeRegistryController } from './digital-genome-registry.controller';
import { DigitalGenomeRegistryService } from './digital-genome-registry.service';

@Module({
  controllers: [DigitalGenomeRegistryController],
  providers: [DigitalGenomeRegistryService],
  exports: [DigitalGenomeRegistryService],
})
export class DigitalGenomeRegistryModule {}