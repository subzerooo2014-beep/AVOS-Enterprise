import { Injectable } from "@nestjs/common";
import { PartnerClientService } from "../partner-client.service";

@Injectable()
export class InsuranceProvider {
  constructor(private readonly client: PartnerClientService) {}
  submit(payload: Record<string, unknown>) {
    return this.client.execute({
      category: "INSURANCE",
      operation: "REQUEST_INSURANCE_QUOTE",
      payload,
    });
  }
}
