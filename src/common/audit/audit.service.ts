import { Injectable } from "@nestjs/common";

@Injectable()
export class AuditService {
  log(action: string, entity: string, entityId?: string, userId?: string) {
    return {
      action,
      entity,
      entityId,
      userId,
      createdAt: new Date().toISOString(),
    };
  }
}
