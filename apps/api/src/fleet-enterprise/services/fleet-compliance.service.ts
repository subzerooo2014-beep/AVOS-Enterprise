import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetComplianceService {
  evaluate(input: { expiredLicenses: number; overdueInspections: number; unresolvedClaims: number }) {
    const issues = input.expiredLicenses + input.overdueInspections + input.unresolvedClaims;
    return { compliant: issues === 0, issues };
  }
}
