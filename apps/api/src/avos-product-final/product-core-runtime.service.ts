import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductCoreRuntimeService {
  activate() {
    return {
      productCore: true,
      marketplace: true,
      vehiclePlatform: true,
      buyerMatching: true,
      sellerOperations: true,
      dealerPlatform: true,
      fleetPlatform: true,
      score: 96,
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
    };
  }
}