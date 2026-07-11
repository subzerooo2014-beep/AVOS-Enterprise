import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionService {

  private sessions = new Map<string, any>();

  create(userId: string, token: string) {
    this.sessions.set(token, {
      userId,
      createdAt: new Date(),
    });
    return token;
  }

  find(token: string) {
    return this.sessions.get(token);
  }

  revoke(token: string) {
    return this.sessions.delete(token);
  }

}
