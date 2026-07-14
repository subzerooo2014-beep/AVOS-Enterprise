import { Module } from "@nestjs/common";
import { SuperAppV4Controller } from "./super-app-v4.controller";
import { SuperAppV4PartnerGatewayService } from "./super-app-v4.partner-gateway.service";
import { SuperAppV4WebhookService } from "./super-app-v4.webhook.service";
import { SuperAppV4WorkflowService } from "./super-app-v4.workflow.service";

@Module({
  controllers: [SuperAppV4Controller],
  providers: [
    SuperAppV4PartnerGatewayService,
    SuperAppV4WebhookService,
    SuperAppV4WorkflowService,
  ],
  exports: [
    SuperAppV4PartnerGatewayService,
    SuperAppV4WebhookService,
    SuperAppV4WorkflowService,
  ],
})
export class SuperAppV4Module {}
