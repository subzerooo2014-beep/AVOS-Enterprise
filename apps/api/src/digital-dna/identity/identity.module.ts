import { Module } from "@nestjs/common";
import { DigitalDnaIdentityController } from "./identity.controller";
import { DigitalDnaIdentityService } from "./identity.service";

@Module({
  controllers: [DigitalDnaIdentityController],
  providers: [DigitalDnaIdentityService],
  exports: [DigitalDnaIdentityService],
})
export class DigitalDnaIdentityModule {}