import { Module } from "@nestjs/common";
import { IntegrationspaymentController } from "./integrationspayment.controller";
import { IntegrationspaymentService } from "./integrationspayment.service";

@Module({
  controllers:[IntegrationspaymentController],
  providers:[IntegrationspaymentService],
})
export class IntegrationspaymentModule{}
