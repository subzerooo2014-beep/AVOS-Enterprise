import { Module } from "@nestjs/common";
import { Galaxy2Domain079Controller } from "./galaxy-2-domain-079.controller";
import { Galaxy2Domain079Service } from "./galaxy-2-domain-079.service";

@Module({
  controllers: [Galaxy2Domain079Controller],
  providers: [Galaxy2Domain079Service],
  exports: [Galaxy2Domain079Service],
})
export class Galaxy2Domain079Module {}