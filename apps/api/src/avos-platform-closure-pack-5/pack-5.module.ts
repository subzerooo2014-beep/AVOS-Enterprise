import { Module } from '@nestjs/common';
import { Pack5Service } from './pack-5.service';

@Module({
  providers: [Pack5Service],
  exports: [Pack5Service],
})
export class Pack5Module {}