import {
  V4BackendArtifact,
  V4BackendDomain,
} from "./contracts";
import { backendKebab, backendPascal } from "./name-utils";

export class V4PolicyEventGenerator {
  generate(
    domain: V4BackendDomain,
    options: {
      enableRbac: boolean;
      enableEvents: boolean;
    },
  ): V4BackendArtifact[] {
    const key = backendKebab(domain.key);
    const entity = backendPascal(domain.entityName);
    const artifacts: V4BackendArtifact[] = [];

    if (options.enableRbac) {
      artifacts.push({
        relativePath: `apps/api/src/${key}/policies/${key}.policy.ts`,
        kind: "policy",
        content: `export const ${entity}Permissions = {
  read: "${key}:read",
  create: "${key}:create",
  update: "${key}:update",
  delete: "${key}:delete",
} as const;
`,
        metadata: { domain: domain.key },
      });
    }

    if (options.enableEvents) {
      artifacts.push({
        relativePath: `apps/api/src/${key}/events/${key}.events.ts`,
        kind: "event",
        content: `export const ${entity}Events = {
  created: "${key}.created",
  updated: "${key}.updated",
  deleted: "${key}.deleted",
} as const;
`,
        metadata: { domain: domain.key },
      });
    }

    return artifacts;
  }
}
