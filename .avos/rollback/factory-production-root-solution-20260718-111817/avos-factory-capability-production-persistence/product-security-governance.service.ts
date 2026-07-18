import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductSecurityGovernanceService {
  evaluate(input: {
    productId: string;
    approvedBy: string;
    environment: string;
  }) {
    const humanApproved = input.approvedBy.startsWith("human:");

    return {
      productId: input.productId,
      allowed: humanApproved,
      policies: {
        leastPrivilege: true,
        zeroTrustReady: true,
        auditByDesign: true,
        dataProvenance: true,
        explainability: true,
        humanFinalAuthority: true,
        productionApproval:
          input.environment !== "production" || humanApproved
      },
      violations: humanApproved ? [] : ["human-final-authority-required"],
      score: humanApproved ? 100 : 0
    };
  }
}
