import { Injectable } from "@nestjs/common";
import { PartnerClientService } from "../partner-client.service";

@Injectable()
export class InspectionProvider {
  constructor(private readonly client: PartnerClientService) {}
  submit(payload: Record<string, unknown>) {
    return this.client.execute({
      category: "INSPECTION",
      operation: "BOOK_VEHICLE_INSPECTION",
      payload,
    });
  }
}
