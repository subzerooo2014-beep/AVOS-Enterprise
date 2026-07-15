import { Module } from "@nestjs/common";
import { GalaxyBundle5Module } from "../galaxy-bundle-5/galaxy-bundle-5.module";
import { GalaxyBundle6Module } from "../galaxy-bundle-6/galaxy-bundle-6.module";
import { GalaxyBundle7Module } from "../galaxy-bundle-7/galaxy-bundle-7.module";
import { GalaxyBundle8Module } from "../galaxy-bundle-8/galaxy-bundle-8.module";

@Module({
  imports: [
    GalaxyBundle5Module,
    GalaxyBundle6Module,
    GalaxyBundle7Module,
    GalaxyBundle8Module,
  ],
  exports: [
    GalaxyBundle5Module,
    GalaxyBundle6Module,
    GalaxyBundle7Module,
    GalaxyBundle8Module,
  ],
})
export class UnifiedFinalGalaxyModule {}