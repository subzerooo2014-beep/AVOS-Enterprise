import { Module } from "@nestjs/common";
import { DigitalGenomeCapabilitiesController } from "./capabilities.controller";
import { DigitalGenomeCapabilitiesService } from "./capabilities.service";

@Module({
  controllers: [DigitalGenomeCapabilitiesController],
  providers: [DigitalGenomeCapabilitiesService],
  exports: [DigitalGenomeCapabilitiesService],
})
export class DigitalGenomeCapabilitiesModule {}