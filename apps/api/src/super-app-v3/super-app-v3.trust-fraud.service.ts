import { Injectable } from "@nestjs/common";

@Injectable()
export class SuperAppV3TrustFraudService {
  evaluate(input: {
    buyerTrust: number;
    sellerTrust: number;
    vehicleTrust: number;
    priceDeviationPercent: number;
    suspiciousSignals?: number;
  }) {
    const suspiciousSignals = Math.max(0, input.suspiciousSignals ?? 0);
    const averageTrust =
      (input.buyerTrust + input.sellerTrust + input.vehicleTrust) / 3;

    const deviationRisk = Math.min(
      45,
      Math.abs(input.priceDeviationPercent) * 1.5,
    );
    const signalRisk = Math.min(40, suspiciousSignals * 10);
    const trustRisk = Math.max(0, 100 - averageTrust) * 0.35;

    const fraudRisk = Math.max(
      0,
      Math.min(100, Math.round(deviationRisk + signalRisk + trustRisk)),
    );

    return {
      trustScore: Math.max(0, Math.min(100, Math.round(averageTrust))),
      fraudRisk,
      decision:
        fraudRisk >= 70
          ? "BLOCK"
          : fraudRisk >= 40
            ? "MANUAL_REVIEW"
            : "ALLOW",
    };
  }
}
