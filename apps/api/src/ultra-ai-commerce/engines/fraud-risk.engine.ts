import { Injectable } from "@nestjs/common";
import { clamp } from "../ultra-ai-commerce.utils";

@Injectable()
export class FraudRiskEngine {
  evaluate(input: { buyerTrust: number; sellerTrust: number; vehicleTrust: number; priceDeviationPercent: number; suspiciousSignals?: number }) {
    const trustRisk = 100 - (input.buyerTrust + input.sellerTrust + input.vehicleTrust) / 3;
    const priceRisk = Math.min(45, Math.abs(input.priceDeviationPercent) * 1.5);
    const signalRisk = Math.min(40, (input.suspiciousSignals ?? 0) * 10);
    const risk = clamp(trustRisk * 0.35 + priceRisk + signalRisk);
    return { risk, decision: risk >= 70 ? "BLOCK" : risk >= 40 ? "REVIEW" : "ALLOW" };
  }
}
