import { Module } from '@nestjs/common';
import { DigitalDnaRegistryController } from './digital-dna-registry.controller';
import { DigitalDnaRegistryService } from './digital-dna-registry.service';

@Module({
  controllers: [DigitalDnaRegistryController],
  providers: [DigitalDnaRegistryService],
  exports: [DigitalDnaRegistryService],
})
export class DigitalDnaRegistryModule {}