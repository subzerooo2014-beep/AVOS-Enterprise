import { Module } from "@nestjs/common";
import { SuperAppV3Module } from "../super-app-v3/super-app-v3.module";
import { SuperAppV4Module } from "../super-app-v4/super-app-v4.module";
import { SuperAppV5Module } from "../super-app-v5/super-app-v5.module";
import { SuperAppV6Module } from "../super-app-v6/super-app-v6.module";
import { SuperAppStabilizationController } from "./super-app-stabilization.controller";
import { SuperAppStabilizationService } from "./super-app-stabilization.service";

@Module({
  imports: [
    SuperAppV3Module,
    SuperAppV4Module,
    SuperAppV5Module,
    SuperAppV6Module,
  ],
  controllers: [SuperAppStabilizationController],
  providers: [SuperAppStabilizationService],
  exports: [SuperAppStabilizationService],
})
export class SuperAppStabilizationModule {}
