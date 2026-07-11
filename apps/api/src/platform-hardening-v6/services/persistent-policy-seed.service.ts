import {
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { PolicyVersioningService } from "./policy-versioning.service";

@Injectable()
export class PersistentPolicySeedService
  implements OnModuleInit
{
  constructor(
    private readonly policies:
      PolicyVersioningService,
  ) {}

  async onModuleInit(): Promise<void> {
    const summary =
      await this.policies.getSummary();

    if (summary.totalPolicies > 0) {
      return;
    }

    const defaults = [
      {
        id: "protect-user-deletion",
        name: "Protect User Deletion",
        description:
          "Requires explicit approval before deleting users",
        enabled: true,
        methods: ["DELETE"],
        pathPrefixes: ["/users"],
        requireApprovalToken: true,
        blockInProduction: false,
        severity: "critical",
      },
      {
        id: "protect-customer-deletion",
        name: "Protect Customer Deletion",
        description:
          "Requires explicit approval before deleting customers",
        enabled: true,
        methods: ["DELETE"],
        pathPrefixes: ["/customers"],
        requireApprovalToken: true,
        blockInProduction: false,
        severity: "error",
      },
      {
        id: "protect-vehicle-deletion",
        name: "Protect Vehicle Deletion",
        description:
          "Requires explicit approval before deleting vehicles",
        enabled: true,
        methods: ["DELETE"],
        pathPrefixes: ["/vehicles"],
        requireApprovalToken: true,
        blockInProduction: false,
        severity: "error",
      },
      {
        id: "protect-system-configuration",
        name: "Protect System Configuration",
        description:
          "Requires approval for sensitive configuration changes",
        enabled: true,
        methods: ["POST", "PUT", "PATCH"],
        pathPrefixes: [
          "/platform-hardening",
          "/system-config",
          "/settings/security",
        ],
        requireApprovalToken: true,
        blockInProduction: false,
        severity: "critical",
      },
      {
        id: "block-development-reset",
        name: "Block Development Reset",
        description:
          "Blocks reset endpoints in production",
        enabled: true,
        methods: ["POST", "DELETE"],
        pathPrefixes: [
          "/dev/reset",
          "/test/reset",
          "/seed/reset",
        ],
        requireApprovalToken: false,
        blockInProduction: true,
        severity: "critical",
      },
    ];

    for (const policy of defaults) {
      await this.policies.create({
        ...policy,
        changeReason:
          "Imported from Production Hardening V5 defaults",
        changedBy:
          "platform-bootstrap",
      });
    }
  }
}
