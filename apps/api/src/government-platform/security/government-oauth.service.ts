import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentOAuthService {
  private readonly tokens = new Map<string, { token: string; expiresAt: number }>();
  get(provider: string) {
    const current = this.tokens.get(provider);
    if (current && current.expiresAt > Date.now() + 30000) return current.token;
    const token = `gov_oauth_${provider}_${Date.now()}`;
    this.tokens.set(provider, { token, expiresAt: Date.now() + 3600000 });
    return token;
  }
}
