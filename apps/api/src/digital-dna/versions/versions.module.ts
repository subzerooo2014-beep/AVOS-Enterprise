import { Module } from "@nestjs/common";
import { DigitalDnaVersionsController } from "./versions.controller";
import { DigitalDnaVersionsService } from "./versions.service";

@Module({
  controllers: [DigitalDnaVersionsController],
  providers: [DigitalDnaVersionsService],
  exports: [DigitalDnaVersionsService],
})
export class DigitalDnaVersionsModule {}