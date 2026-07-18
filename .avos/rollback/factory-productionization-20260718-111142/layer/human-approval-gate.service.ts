import { Injectable } from "@nestjs/common";

@Injectable()
export class HumanApprovalGateService {
  verify(approvedBy: string) {
    const approved = approvedBy?.startsWith("human:");

    return {
      approved,
      approvedBy,
      authority: "human-final-authority",
      autonomousOverrideAllowed: false,
      verifiedAt: new Date().toISOString(),
      score: approved ? 100 : 0
    };
  }
}
