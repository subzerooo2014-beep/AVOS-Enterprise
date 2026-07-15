import { Module } from "@nestjs/common";
import { GalaxyBundle1Controller } from "./galaxy-bundle-1.controller";
import { GalaxyBundle1GeneratedModule } from "./galaxy-bundle-1.generated.module";

@Module({
  imports: [GalaxyBundle1GeneratedModule],
  controllers: [GalaxyBundle1Controller],
  exports: [GalaxyBundle1GeneratedModule],
})
export class GalaxyBundle1RootModule {}