import { Module } from "@nestjs/common";
import { Galaxy2Domain006Controller } from "./galaxy-2-domain-006.controller";
import { Galaxy2Domain006Service } from "./galaxy-2-domain-006.service";

@Module({
  controllers: [Galaxy2Domain006Controller],
  providers: [Galaxy2Domain006Service],
  exports: [Galaxy2Domain006Service],
})
export class Galaxy2Domain006Module {}