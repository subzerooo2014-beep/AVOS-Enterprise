import {
  V4DomainInput,
  V4EntityInsight,
  V4RelationshipInsight,
} from "./contracts";

export class V4DomainInference {
  inferEntities(
    domains: readonly V4DomainInput[],
  ): V4EntityInsight[] {
    return domains.map((domain) => ({
      entity: domain.entityName,
      aggregateRoot: true,
      identifiers: domain.fields
        .filter(
          (field) =>
            field.unique ||
            ["id", "reference", "number", "email", "vin"].includes(
              field.name.toLowerCase(),
            ),
        )
        .map((field) => field.name),
      searchableFields: domain.fields
        .filter(
          (field) =>
            field.type === "string" ||
            field.type === "number",
        )
        .map((field) => field.name),
      auditable: true,
    }));
  }

  inferRelationships(
    domains: readonly V4DomainInput[],
  ): V4RelationshipInsight[] {
    const domainByEntity = new Map(
      domains.map((domain) => [
        domain.entityName.toLowerCase(),
        domain.key,
      ]),
    );

    const relationships: V4RelationshipInsight[] = [];

    for (const domain of domains) {
      for (const field of domain.fields) {
        if (!field.name.toLowerCase().endsWith("id")) continue;

        const rawTarget = field.name.slice(0, -2).toLowerCase();
        const targetDomain = domainByEntity.get(rawTarget);

        if (targetDomain && targetDomain !== domain.key) {
          relationships.push({
            sourceDomain: domain.key,
            targetDomain,
            relation: "one-to-many",
            inferredBy: field.name,
            confidence: 94,
          });
        }
      }
    }

    return relationships;
  }
}
