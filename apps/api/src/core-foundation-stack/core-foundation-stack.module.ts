import { Module } from "@nestjs/common";
import { CoreFoundationStackController } from "./core-foundation-stack.controller";
import { CoreFoundationStackService } from "./core-foundation-stack.service";

@Module({
  controllers: [CoreFoundationStackController],
  providers: [CoreFoundationStackService],
  exports: [CoreFoundationStackService],
})
export class CoreFoundationStackModule {}