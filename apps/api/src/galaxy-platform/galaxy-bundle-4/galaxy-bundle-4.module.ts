import { Module } from "@nestjs/common";
import { GalaxyBundle4Controller } from "./galaxy-bundle-4.controller";
import { GalaxyBundle4Service } from "./galaxy-bundle-4.service";

@Module({
  controllers: [GalaxyBundle4Controller],
  providers: [GalaxyBundle4Service],
  exports: [GalaxyBundle4Service],
})
export class GalaxyBundle4Module {}