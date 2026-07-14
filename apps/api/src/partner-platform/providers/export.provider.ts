import { Injectable } from "@nestjs/common";
import { PartnerClientService } from "../partner-client.service";

@Injectable()
export class ExportProvider {
  constructor(private readonly client: PartnerClientService) {}
  submit(payload: Record<string, unknown>) {
    return this.client.execute({
      category: "EXPORT",
      operation: "CREATE_EXPORT_CASE",
      payload,
    });
  }
}
