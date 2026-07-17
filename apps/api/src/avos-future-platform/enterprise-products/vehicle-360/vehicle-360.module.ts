import { Module } from '@nestjs/common';
import { Vehicle360Controller } from './vehicle-360.controller';
import { Vehicle360Service } from './vehicle-360.service';

@Module({
  controllers: [Vehicle360Controller],
  providers: [Vehicle360Service],
  exports: [Vehicle360Service],
})
export class Vehicle360Module {}