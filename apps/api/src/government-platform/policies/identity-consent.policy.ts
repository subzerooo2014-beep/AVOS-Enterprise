import { Injectable } from "@nestjs/common";
@Injectable()
export class IdentityConsentPolicy {
  validate(scope: string[], expiresAt: string) {
    if (!scope.length) throw new Error("Consent scope required");
    if (new Date(expiresAt) <= new Date()) throw new Error("Consent already expired");
    return true;
  }
}
