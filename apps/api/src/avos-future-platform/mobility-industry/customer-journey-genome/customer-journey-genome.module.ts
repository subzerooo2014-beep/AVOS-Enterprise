import { Module } from '@nestjs/common';
import { CustomerJourneyGenomeController } from './customer-journey-genome.controller';
import { CustomerJourneyGenomeService } from './customer-journey-genome.service';

@Module({
  controllers: [CustomerJourneyGenomeController],
  providers: [CustomerJourneyGenomeService],
  exports: [CustomerJourneyGenomeService],
})
export class CustomerJourneyGenomeModule {}