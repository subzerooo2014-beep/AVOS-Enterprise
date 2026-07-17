import { Module } from "@nestjs/common";
import { DigitalGenomeCertificationController } from "./certification.controller";
import { DigitalGenomeCertificationService } from "./certification.service";

@Module({
  controllers: [DigitalGenomeCertificationController],
  providers: [DigitalGenomeCertificationService],
  exports: [DigitalGenomeCertificationService],
})
export class DigitalGenomeCertificationModule {}