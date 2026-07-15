import { Module } from "@nestjs/common";
import { Galaxy2Domain028Controller } from "./galaxy-2-domain-028.controller";
import { Galaxy2Domain028Service } from "./galaxy-2-domain-028.service";

@Module({
  controllers: [Galaxy2Domain028Controller],
  providers: [Galaxy2Domain028Service],
  exports: [Galaxy2Domain028Service],
})
export class Galaxy2Domain028Module {}