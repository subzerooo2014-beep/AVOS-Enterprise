import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthAuditService {

  log(action: string, userId?: string) {
    return {
      action,
      userId,
      timestamp: new Date().toISOString(),
    };
  }

}
