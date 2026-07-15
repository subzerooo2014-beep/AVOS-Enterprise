import { Module } from "@nestjs/common";
import { GalaxyBundle7Controller } from "./galaxy-bundle-7.controller";
import { GalaxyBundle7Service } from "./galaxy-bundle-7.service";

@Module({
  controllers: [GalaxyBundle7Controller],
  providers: [GalaxyBundle7Service],
  exports: [GalaxyBundle7Service],
})
export class GalaxyBundle7Module {}