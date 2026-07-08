import { Module } from "@nestjs/common";
import { IntegrationssmsController } from "./integrationssms.controller";
import { IntegrationssmsService } from "./integrationssms.service";

@Module({
  controllers:[IntegrationssmsController],
  providers:[IntegrationssmsService],
})
export class IntegrationssmsModule{}
