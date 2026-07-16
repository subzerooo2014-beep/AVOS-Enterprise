import { Module } from "@nestjs/common";
import { {{CONTROLLER_NAME}} } from "./{{MODULE_SLUG}}.controller";
import { {{SERVICE_NAME}} } from "./{{MODULE_SLUG}}.service";

@Module({
  controllers: [{{CONTROLLER_NAME}}],
  providers: [{{SERVICE_NAME}}],
  exports: [{{SERVICE_NAME}}],
})
export class {{MODULE_NAME}} {}