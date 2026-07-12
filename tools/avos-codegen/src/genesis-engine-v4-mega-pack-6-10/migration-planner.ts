import {
  V4DatabaseInput,
  V4MigrationStep,
} from "./contracts";

export class V4MigrationPlanner {
  plan(input: V4DatabaseInput): V4MigrationStep[] {
    const steps: V4MigrationStep[] = [];
    let order = 1;

    for (const domain of input.domains) {
      steps.push({
        order: order++,
        key: `create-${domain.key}`,
        action: `create table for ${domain.entityName}`,
        reversible: true,
      });

      for (const field of domain.fields.filter(
        (item) => item.unique,
      )) {
        steps.push({
          order: order++,
          key: `unique-${domain.key}-${field.name}`,
          action: `create unique constraint on ${domain.key}.${field.name}`,
          reversible: true,
        });
      }
    }

    for (const relationship of input.relationships) {
      steps.push({
        order: order++,
        key: `relation-${relationship.sourceDomain}-${relationship.targetDomain}`,
        action: `create ${relationship.relation} relation from ${relationship.sourceDomain} to ${relationship.targetDomain}`,
        reversible: true,
      });
    }

    return steps;
  }
}
