import { Module } from "@nestjs/common";
import { IntegrationsemailController } from "./integrationsemail.controller";
import { IntegrationsemailService } from "./integrationsemail.service";

@Module({
  controllers:[IntegrationsemailController],
  providers:[IntegrationsemailService],
})
export class IntegrationsemailModule{}
