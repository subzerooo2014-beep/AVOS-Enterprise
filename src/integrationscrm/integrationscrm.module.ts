import { Module } from "@nestjs/common";
import { IntegrationscrmController } from "./integrationscrm.controller";
import { IntegrationscrmService } from "./integrationscrm.service";

@Module({
  controllers:[IntegrationscrmController],
  providers:[IntegrationscrmService],
})
export class IntegrationscrmModule{}
