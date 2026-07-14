import { Injectable } from "@nestjs/common";
@Injectable()
export class DiscoveryService {
  shortlist(input: { buyerId: string; vehicleId: string; notes?: string }) {
    return { id: `short_${Date.now()}`, ...input, createdAt: new Date().toISOString() };
  }
}
