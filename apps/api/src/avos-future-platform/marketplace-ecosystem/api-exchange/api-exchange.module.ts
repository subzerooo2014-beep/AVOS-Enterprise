import { Module } from '@nestjs/common';
import { ApiExchangeController } from './api-exchange.controller';
import { ApiExchangeService } from './api-exchange.service';

@Module({
  controllers: [ApiExchangeController],
  providers: [ApiExchangeService],
  exports: [ApiExchangeService],
})
export class ApiExchangeModule {}