import { Injectable } from "@nestjs/common";
import { PartnerClientService } from "../partner-client.service";

@Injectable()
export class ShippingProvider {
  constructor(private readonly client: PartnerClientService) {}
  submit(payload: Record<string, unknown>) {
    return this.client.execute({
      category: "SHIPPING",
      operation: "REQUEST_SHIPMENT",
      payload,
    });
  }
}
