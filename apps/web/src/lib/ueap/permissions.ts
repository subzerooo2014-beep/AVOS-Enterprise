export type PermissionContext = {
  permissions: string[];
  roles: string[];
  tenantId?: string;
};

export function can(
  context: PermissionContext,
  permission: string,
): boolean {
  return (
    context.permissions.includes("*") ||
    context.permissions.includes(permission)
  );
}

export function filterByPermission<T extends { permissions: string[] }>(
  entries: T[],
  context: PermissionContext,
): T[] {
  return entries.filter((entry) =>
    entry.permissions.length === 0 ||
    entry.permissions.some((permission) => can(context, permission)),
  );
}
