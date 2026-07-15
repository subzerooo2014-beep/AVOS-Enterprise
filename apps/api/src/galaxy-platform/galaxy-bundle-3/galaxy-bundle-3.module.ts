import { Module } from "@nestjs/common";
import { GalaxyBundle3Controller } from "./galaxy-bundle-3.controller";
import { GalaxyBundle3Service } from "./galaxy-bundle-3.service";

@Module({
  controllers: [GalaxyBundle3Controller],
  providers: [GalaxyBundle3Service],
  exports: [GalaxyBundle3Service],
})
export class GalaxyBundle3Module {}