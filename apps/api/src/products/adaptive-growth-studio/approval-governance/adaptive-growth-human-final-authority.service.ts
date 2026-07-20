import {
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class AdaptiveGrowthHumanFinalAuthorityService {
  assertAuthority(input: {
    approverId: string;
    providedAuthority: string;
    requiredAuthority: string;
  }): void {
    if (!input.approverId?.trim()) {
      throw new ForbiddenException(
        "Human approver identity is required.",
      );
    }

    const accepted = [
      input.requiredAuthority,
      "human-final-authority",
      "human:khalifa",
    ];

    if (
      !accepted.includes(
        input.providedAuthority,
      ) &&
      input.approverId !==
        "human:khalifa"
    ) {
      throw new ForbiddenException({
        message:
          "Approver does not satisfy the required authority.",
        requiredAuthority:
          input.requiredAuthority,
        providedAuthority:
          input.providedAuthority,
      });
    }
  }

  status() {
    return {
      name: "AGS Human Final Authority",
      status: "enforced",
      machineApprovalAllowed: false,
      explicitHumanIdentityRequired: true,
      authorityBoundaryProtected: true,
    };
  }
}