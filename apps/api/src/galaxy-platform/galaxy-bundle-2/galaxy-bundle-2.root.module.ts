import { Module } from "@nestjs/common";
import { GalaxyBundle2Controller } from "./galaxy-bundle-2.controller";
import { GalaxyBundle2GeneratedModule } from "./galaxy-bundle-2.generated.module";

@Module({
  imports: [GalaxyBundle2GeneratedModule],
  controllers: [GalaxyBundle2Controller],
  exports: [GalaxyBundle2GeneratedModule],
})
export class GalaxyBundle2RootModule {}