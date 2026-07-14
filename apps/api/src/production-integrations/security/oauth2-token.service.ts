import { Injectable } from "@nestjs/common";

@Injectable()
export class OAuth2TokenService {
  private readonly tokens = new Map<string, { token: string; expiresAt: number }>();

  get(providerCode: string) {
    const current = this.tokens.get(providerCode);
    if (current && current.expiresAt > Date.now() + 30000) return current.token;
    const token = `oauth_${providerCode}_${Date.now()}`;
    this.tokens.set(providerCode, { token, expiresAt: Date.now() + 3600000 });
    return token;
  }
}
