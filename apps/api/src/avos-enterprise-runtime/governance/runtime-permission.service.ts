import { Injectable } from '@nestjs/common';

@Injectable()
export class RuntimePermissionService {
  private readonly grants = new Map<string, Set<string>>();

  grant(subject: string, permission: string): void {
    const permissions = this.grants.get(subject) ?? new Set<string>();
    permissions.add(permission);
    this.grants.set(subject, permissions);
  }

  revoke(subject: string, permission: string): void {
    this.grants.get(subject)?.delete(permission);
  }

  has(subject: string, permission: string): boolean {
    const permissions = this.grants.get(subject);
    return Boolean(
      permissions?.has(permission) || permissions?.has('*'),
    );
  }

  list(subject: string): string[] {
    return [...(this.grants.get(subject) ?? [])].sort();
  }
}