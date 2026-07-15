import { Module } from "@nestjs/common";
import { GalaxyBundle5Controller } from "./galaxy-bundle-5.controller";
import { GalaxyBundle5Service } from "./galaxy-bundle-5.service";

@Module({
  controllers: [GalaxyBundle5Controller],
  providers: [GalaxyBundle5Service],
  exports: [GalaxyBundle5Service],
})
export class GalaxyBundle5Module {}