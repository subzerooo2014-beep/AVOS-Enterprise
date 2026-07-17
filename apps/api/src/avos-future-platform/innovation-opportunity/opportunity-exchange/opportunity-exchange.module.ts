import { Module } from '@nestjs/common';
import { OpportunityExchangeController } from './opportunity-exchange.controller';
import { OpportunityExchangeService } from './opportunity-exchange.service';

@Module({
  controllers: [OpportunityExchangeController],
  providers: [OpportunityExchangeService],
  exports: [OpportunityExchangeService],
})
export class OpportunityExchangeModule {}