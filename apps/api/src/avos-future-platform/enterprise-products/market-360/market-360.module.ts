import { Module } from '@nestjs/common';
import { Market360Controller } from './market-360.controller';
import { Market360Service } from './market-360.service';

@Module({
  controllers: [Market360Controller],
  providers: [Market360Service],
  exports: [Market360Service],
})
export class Market360Module {}