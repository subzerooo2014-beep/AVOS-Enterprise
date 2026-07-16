import { Injectable } from "@nestjs/common";

@Injectable()
export class SecurityRiskEngineService {
  score(context: Record<string, unknown> = {}): number {
    let score = 0;

    if (context["failedAttempts"] && Number(context["failedAttempts"]) > 3) {
      score += 40;
    }

    if (context["untrustedDevice"] === true) score += 25;
    if (context["unusualLocation"] === true) score += 20;
    if (context["privilegedAction"] === true) score += 15;

    return Math.min(100, score);
  }
}
