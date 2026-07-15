import { Module } from "@nestjs/common";
import { Galaxy2Domain049Controller } from "./galaxy-2-domain-049.controller";
import { Galaxy2Domain049Service } from "./galaxy-2-domain-049.service";

@Module({
  controllers: [Galaxy2Domain049Controller],
  providers: [Galaxy2Domain049Service],
  exports: [Galaxy2Domain049Service],
})
export class Galaxy2Domain049Module {}