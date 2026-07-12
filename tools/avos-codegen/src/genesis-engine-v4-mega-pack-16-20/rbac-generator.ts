import {
  V4FrontendArtifact,
  V4FrontendDomain,
} from "./contracts";
import { frontendKebab, frontendPascal } from "./name-utils";

export class V4FrontendRbacGenerator {
  generate(domains: readonly V4FrontendDomain[]): V4FrontendArtifact {
    const permissions = domains
      .flatMap((domain) => {
        const key = frontendKebab(domain.key);
        const entity = frontendPascal(domain.entityName);

        return [
          `  ${entity}Read: "${key}:read",`,
          `  ${entity}Create: "${key}:create",`,
          `  ${entity}Update: "${key}:update",`,
          `  ${entity}Delete: "${key}:delete",`,
        ];
      })
      .join("\n");

    return {
      relativePath: "apps/web/lib/auth/permissions.ts",
      kind: "rbac",
      content: `export const Permissions = {
${permissions}
} as const;

export type Permission =
  (typeof Permissions)[keyof typeof Permissions];

export function can(
  userPermissions: readonly string[],
  permission: Permission,
): boolean {
  return userPermissions.includes(permission);
}
`,
      metadata: { permissions: domains.length * 4 },
    };
  }
}
