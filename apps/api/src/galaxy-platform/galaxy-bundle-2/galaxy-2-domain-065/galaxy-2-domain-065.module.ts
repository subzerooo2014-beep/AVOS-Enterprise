import { Module } from "@nestjs/common";
import { Galaxy2Domain065Controller } from "./galaxy-2-domain-065.controller";
import { Galaxy2Domain065Service } from "./galaxy-2-domain-065.service";

@Module({
  controllers: [Galaxy2Domain065Controller],
  providers: [Galaxy2Domain065Service],
  exports: [Galaxy2Domain065Service],
})
export class Galaxy2Domain065Module {}