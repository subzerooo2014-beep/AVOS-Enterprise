import { Module } from "@nestjs/common";
import { GalaxyBundle6Controller } from "./galaxy-bundle-6.controller";
import { GalaxyBundle6Service } from "./galaxy-bundle-6.service";

@Module({
  controllers: [GalaxyBundle6Controller],
  providers: [GalaxyBundle6Service],
  exports: [GalaxyBundle6Service],
})
export class GalaxyBundle6Module {}