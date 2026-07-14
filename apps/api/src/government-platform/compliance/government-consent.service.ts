import { Injectable } from "@nestjs/common";
import { IdentityConsentPolicy } from "../policies/identity-consent.policy";
@Injectable()
export class GovernmentConsentService {
  private readonly consents: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: IdentityConsentPolicy) {}
  create(input: { userId: string; provider: string; scope: string[]; expiresAt: string }) {
    this.policy.validate(input.scope, input.expiresAt);
    const consent = {
      id: `consent_${Date.now()}`,
      ...input,
      active: true,
      createdAt: new Date().toISOString(),
    };
    this.consents.push(consent);
    return consent;
  }
  list() { return [...this.consents]; }
}
