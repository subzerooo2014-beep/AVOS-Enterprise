import { Module } from "@nestjs/common";
import { ArchitectureCertificationController } from "./certification.controller";
import { ArchitectureCertificationService } from "./certification.service";

@Module({
  controllers: [ArchitectureCertificationController],
  providers: [ArchitectureCertificationService],
  exports: [ArchitectureCertificationService],
})
export class ArchitectureCertificationModule {}