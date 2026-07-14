import { Injectable } from "@nestjs/common";
import { PartnerClientService } from "../partner-client.service";

@Injectable()
export class FinanceProvider {
  constructor(private readonly client: PartnerClientService) {}
  submit(payload: Record<string, unknown>) {
    return this.client.execute({
      category: "FINANCE",
      operation: "SUBMIT_FINANCE_APPLICATION",
      payload,
    });
  }
}
