import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: ["users.read", "users.manage", "roles.read", "roles.manage"],
  MANAGER: ["users.read", "roles.read"],
  USER: ["profile.read"],
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permissions || permissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const role = request.user?.role;

    if (!role) return false;

    const allowed = ROLE_PERMISSIONS[role] || [];
    if (allowed.includes("*")) return true;

    return permissions.every((permission) => allowed.includes(permission));
  }
}
