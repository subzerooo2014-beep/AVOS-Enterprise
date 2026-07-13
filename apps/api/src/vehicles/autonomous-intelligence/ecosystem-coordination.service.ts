import { Injectable } from "@nestjs/common";

@Injectable()
export class EcosystemCoordinationService {
  coordinate(input: {
    buyerReady: boolean;
    sellerReady: boolean;
    financeReady: boolean;
    insuranceReady: boolean;
    logisticsReady: boolean;
  }) {
    const readiness = Object.values(input).filter(Boolean).length;
    return {
      readiness,
      status: readiness === 5 ? "READY" : readiness >= 3 ? "PARTIAL" : "BLOCKED",
    };
  }
}
