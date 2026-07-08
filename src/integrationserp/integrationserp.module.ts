import { Module } from "@nestjs/common";
import { IntegrationserpController } from "./integrationserp.controller";
import { IntegrationserpService } from "./integrationserp.service";

@Module({
  controllers:[IntegrationserpController],
  providers:[IntegrationserpService],
})
export class IntegrationserpModule{}
