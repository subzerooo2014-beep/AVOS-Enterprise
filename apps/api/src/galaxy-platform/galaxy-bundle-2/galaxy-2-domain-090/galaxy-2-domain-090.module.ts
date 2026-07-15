import { Module } from "@nestjs/common";
import { Galaxy2Domain090Controller } from "./galaxy-2-domain-090.controller";
import { Galaxy2Domain090Service } from "./galaxy-2-domain-090.service";

@Module({
  controllers: [Galaxy2Domain090Controller],
  providers: [Galaxy2Domain090Service],
  exports: [Galaxy2Domain090Service],
})
export class Galaxy2Domain090Module {}