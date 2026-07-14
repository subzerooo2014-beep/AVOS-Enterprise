import { Injectable } from "@nestjs/common";
@Injectable()
export class OwnershipTransferService {
  create(input: { journeyId: string; authority: string; reference?: string }) {
    return { id: `transfer_${Date.now()}`, ...input, status: "COMPLETED" };
  }
}
