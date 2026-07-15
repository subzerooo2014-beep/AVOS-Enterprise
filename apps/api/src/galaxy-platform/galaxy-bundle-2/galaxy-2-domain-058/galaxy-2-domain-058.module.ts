import { Module } from "@nestjs/common";
import { Galaxy2Domain058Controller } from "./galaxy-2-domain-058.controller";
import { Galaxy2Domain058Service } from "./galaxy-2-domain-058.service";

@Module({
  controllers: [Galaxy2Domain058Controller],
  providers: [Galaxy2Domain058Service],
  exports: [Galaxy2Domain058Service],
})
export class Galaxy2Domain058Module {}