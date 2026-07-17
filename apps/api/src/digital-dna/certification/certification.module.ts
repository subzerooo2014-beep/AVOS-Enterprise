import { Module } from "@nestjs/common";
import { DigitalDnaCertificationController } from "./certification.controller";
import { DigitalDnaCertificationService } from "./certification.service";

@Module({
  controllers: [DigitalDnaCertificationController],
  providers: [DigitalDnaCertificationService],
  exports: [DigitalDnaCertificationService],
})
export class DigitalDnaCertificationModule {}