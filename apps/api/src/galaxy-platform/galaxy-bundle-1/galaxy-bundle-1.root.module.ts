import { Module } from "@nestjs/common";
import { GalaxyBundle1Controller } from "./galaxy-bundle-1.controller";
import { GalaxyBundle1Module } from "./galaxy-bundle-1.module";

@Module({
  imports: [GalaxyBundle1Module],
  controllers: [GalaxyBundle1Controller],
  exports: [GalaxyBundle1Module],
})
export class GalaxyBundle1RootModule {}