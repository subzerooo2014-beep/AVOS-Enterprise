import {
  V5SecurityInput,
  V5TenantModel,
} from "./contracts";

export class V5TenantRuntimeGenerator {
  generate(input: V5SecurityInput): V5TenantModel {
    const indexes =
      input.tenantStrategy === "shared-schema"
        ? ["tenantId", "tenantId+createdAt", "tenantId+status"]
        : ["tenantKey"];

    return {
      tenantEntity: "Tenant",
      tenantKeyField: "tenantId",
      isolationStrategy: input.tenantStrategy,
      requiredIndexes: indexes,
      lifecycleStates: [
        "provisioning",
        "active",
        "suspended",
        "archived",
      ],
    };
  }

  scopeRules(input: V5SecurityInput): Array<{
    domain: string;
    rule: string;
  }> {
    return input.domains.map((domain) => ({
      domain: domain.key,
      rule:
        input.tenantStrategy === "shared-schema"
          ? `all ${domain.key} queries must include tenantId`
          : `${domain.key} storage must resolve through tenant routing`,
    }));
  }
}
