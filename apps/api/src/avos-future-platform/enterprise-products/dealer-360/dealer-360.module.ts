import { Module } from '@nestjs/common';
import { Dealer360Controller } from './dealer-360.controller';
import { Dealer360Service } from './dealer-360.service';

@Module({
  controllers: [Dealer360Controller],
  providers: [Dealer360Service],
  exports: [Dealer360Service],
})
export class Dealer360Module {}