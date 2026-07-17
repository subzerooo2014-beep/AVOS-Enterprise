import { Module } from "@nestjs/common";
import { DigitalGenomeIntegrationsController } from "./integrations.controller";
import { DigitalGenomeIntegrationsService } from "./integrations.service";

@Module({
  controllers: [DigitalGenomeIntegrationsController],
  providers: [DigitalGenomeIntegrationsService],
  exports: [DigitalGenomeIntegrationsService],
})
export class DigitalGenomeIntegrationsModule {}