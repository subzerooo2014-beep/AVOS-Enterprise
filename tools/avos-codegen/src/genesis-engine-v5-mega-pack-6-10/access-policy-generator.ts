import {
  V5AccessPolicy,
  V5SecurityInput,
} from "./contracts";

export class V5AccessPolicyGenerator {
  generate(input: V5SecurityInput): V5AccessPolicy[] {
    const policies: V5AccessPolicy[] = [];

    for (const role of input.roles) {
      policies.push({
        key: `role.${role.key}`,
        effect: "allow",
        subjects: [role.key],
        resources: input.domains.map((domain) => domain.key),
        actions: role.permissions,
        conditions: [
          "subject.tenantId == resource.tenantId",
          "subject.active == true",
        ],
      });
    }

    if (input.enableAbac !== false) {
      for (const domain of input.domains) {
        policies.push({
          key: `abac.${domain.key}.tenant-scope`,
          effect: "deny",
          subjects: ["*"],
          resources: [domain.key],
          actions: ["*"],
          conditions: [
            "subject.tenantId != resource.tenantId",
          ],
        });
      }
    }

    return policies;
  }
}
