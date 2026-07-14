import { Module } from "@nestjs/common";
import { SuperAppV3Module } from "../super-app-v3/super-app-v3.module";
import { SuperAppV4Module } from "../super-app-v4/super-app-v4.module";
import { SuperAppV5Module } from "../super-app-v5/super-app-v5.module";
import { SuperAppV6Controller } from "./super-app-v6.controller";
import { SuperAppV6RuntimeService } from "./super-app-v6.runtime.service";

@Module({
  imports: [SuperAppV3Module, SuperAppV4Module, SuperAppV5Module],
  controllers: [SuperAppV6Controller],
  providers: [SuperAppV6RuntimeService],
  exports: [SuperAppV6RuntimeService],
})
export class SuperAppV6Module {}
