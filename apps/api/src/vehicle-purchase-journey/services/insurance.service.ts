import { Injectable } from "@nestjs/common";
@Injectable()
export class JourneyInsuranceService {
  request(input: { journeyId: string; coverageType: string; driverAge: number; claimsCount: number }) {
    return { id: `ins_${Date.now()}`, ...input, status: "QUOTED", premiumEstimate: 2500 + input.claimsCount * 500 };
  }
}
