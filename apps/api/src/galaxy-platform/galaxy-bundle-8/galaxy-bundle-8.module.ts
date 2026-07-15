import { Module } from "@nestjs/common";
import { GalaxyBundle8Controller } from "./galaxy-bundle-8.controller";
import { GalaxyBundle8Service } from "./galaxy-bundle-8.service";

@Module({
  controllers: [GalaxyBundle8Controller],
  providers: [GalaxyBundle8Service],
  exports: [GalaxyBundle8Service],
})
export class GalaxyBundle8Module {}