import { Module } from "@nestjs/common";
import { AgpCertificationService } from "./agp-certification.service";
import { AgpConstitutionService } from "./agp-constitution.service";
import { AgpController } from "./agp.controller";
import { AgpHealthService } from "./agp-health.service";
import { AgpMapsService } from "./agp-maps.service";

@Module({
  controllers: [AgpController],
  providers: [AgpConstitutionService, AgpMapsService, AgpHealthService, AgpCertificationService],
  exports: [AgpConstitutionService, AgpMapsService, AgpHealthService, AgpCertificationService],
})
export class AgpModule {}