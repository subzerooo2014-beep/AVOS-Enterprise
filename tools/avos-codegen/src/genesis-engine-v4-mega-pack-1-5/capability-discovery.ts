import {
  V4Capability,
  V4DomainInput,
} from "./contracts";

export class V4CapabilityDiscovery {
  discover(domains: readonly V4DomainInput[]): V4Capability[] {
    return domains.flatMap((domain) => {
      const capabilities: V4Capability[] = [
        {
          key: `${domain.key}.manage`,
          domainKey: domain.key,
          name: `Manage ${domain.entityName}`,
          category: "core",
          confidence: 98,
        },
        {
          key: `${domain.key}.search`,
          domainKey: domain.key,
          name: `Search ${domain.entityName}`,
          category: "supporting",
          confidence: 92,
        },
        {
          key: `${domain.key}.audit`,
          domainKey: domain.key,
          name: `Audit ${domain.entityName}`,
          category: "governance",
          confidence: 88,
        },
      ];

      if (
        domain.fields.some((field) =>
          ["price", "amount", "total", "value", "score"].includes(
            field.name.toLowerCase(),
          ),
        )
      ) {
        capabilities.push({
          key: `${domain.key}.analytics`,
          domainKey: domain.key,
          name: `${domain.entityName} Analytics`,
          category: "analytics",
          confidence: 90,
        });
      }

      return capabilities;
    });
  }
}
