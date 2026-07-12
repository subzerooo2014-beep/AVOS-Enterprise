import { V4EnterpriseIntent } from "./contracts";

export class V4IntentNormalizer {
  normalize(intent: V4EnterpriseIntent): V4EnterpriseIntent {
    const uniqueDomains = new Map(
      intent.domains.map((domain) => [
        domain.key.trim().toLowerCase(),
        {
          ...domain,
          key: domain.key.trim().toLowerCase(),
          entityName: domain.entityName.trim(),
          fields: domain.fields.map((field) => ({
            ...field,
            name: field.name.trim(),
          })),
        },
      ]),
    );

    return {
      ...intent,
      systemKey: intent.systemKey.trim().toLowerCase(),
      systemName: intent.systemName.trim(),
      description: intent.description.trim(),
      domains: Array.from(uniqueDomains.values()),
      businessGoals: Array.from(
        new Set(intent.businessGoals ?? []),
      ),
      targetUsers: Array.from(new Set(intent.targetUsers ?? [])),
      constraints: Array.from(new Set(intent.constraints ?? [])),
    };
  }
}
