import { Injectable } from "@nestjs/common";
import { SuperAppV4PartnerGatewayService } from "./super-app-v4.partner-gateway.service";
import { PartnerType } from "./super-app-v4.types";

@Injectable()
export class SuperAppV4WorkflowService {
  constructor(
    private readonly gateway: SuperAppV4PartnerGatewayService,
  ) {}

  startDealIntegrations(input: {
    dealId: string;
    financingRequired: boolean;
    insuranceRequired: boolean;
    inspectionRequired: boolean;
    paymentRequired: boolean;
    shippingRequired?: boolean;
    exportRequired?: boolean;
  }) {
    const types: PartnerType[] = [];

    if (input.financingRequired) types.push("FINANCE");
    if (input.insuranceRequired) types.push("INSURANCE");
    if (input.inspectionRequired) types.push("INSPECTION");
    if (input.paymentRequired) types.push("PAYMENT");
    if (input.shippingRequired) types.push("SHIPPING");
    if (input.exportRequired) types.push("EXPORT");

    const requests = types.map((partnerType) => {
      const request = this.gateway.createRequest({
        dealId: input.dealId,
        partnerType,
        payload: {
          dealId: input.dealId,
          requestedBy: "AVOS_SUPER_APP_V4",
        },
      });

      return this.gateway.submit(request.id);
    });

    return {
      dealId: input.dealId,
      requestedServices: types,
      requests,
    };
  }
}
