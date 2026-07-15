import { Module } from "@nestjs/common";
import { Galaxy2Domain042Controller } from "./galaxy-2-domain-042.controller";
import { Galaxy2Domain042Service } from "./galaxy-2-domain-042.service";

@Module({
  controllers: [Galaxy2Domain042Controller],
  providers: [Galaxy2Domain042Service],
  exports: [Galaxy2Domain042Service],
})
export class Galaxy2Domain042Module {}