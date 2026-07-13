import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleBuyerDemandService {
  evaluate(input: {
    searches: number;
    saves: number;
    inquiries: number;
    offers: number;
  }) {
    const demandScore = Math.min(
      100,
      Math.round(
        input.searches * 0.1 +
        input.saves * 0.4 +
        input.inquiries * 1.5 +
        input.offers * 3,
      ),
    );

    return {
      demandScore,
      momentum:
        demandScore >= 80
          ? "SURGING"
          : demandScore >= 55
            ? "GROWING"
            : "STABLE",
    };
  }
}
