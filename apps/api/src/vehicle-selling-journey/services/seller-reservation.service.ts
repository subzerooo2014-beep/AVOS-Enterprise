import { Injectable } from "@nestjs/common";
@Injectable()
export class SellerReservationService {
  create(input: {
    journeyId: string;
    buyerId: string;
    depositAmount: number;
  }) {
    return {
      id: `reserve_${Date.now()}`,
      ...input,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  }
}
