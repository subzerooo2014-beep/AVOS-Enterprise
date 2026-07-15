import { Module } from "@nestjs/common";
import { Galaxy2Domain034Controller } from "./galaxy-2-domain-034.controller";
import { Galaxy2Domain034Service } from "./galaxy-2-domain-034.service";

@Module({
  controllers: [Galaxy2Domain034Controller],
  providers: [Galaxy2Domain034Service],
  exports: [Galaxy2Domain034Service],
})
export class Galaxy2Domain034Module {}