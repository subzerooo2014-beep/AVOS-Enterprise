import { Injectable } from "@nestjs/common";
import { createHash, randomBytes } from "crypto";
import {
  AuthenticationSession,
} from "./platform-production-mega-pack-5.types";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";
import { RuntimeIdentityService } from "./runtime-identity.service";
import { SecurityAuditService } from "./security-audit.service";

@Injectable()
export class ServiceAuthenticationService {
  constructor(
    private readonly store: PlatformSecurityFileStoreService,
    private readonly identities: RuntimeIdentityService,
    private readonly audit: SecurityAuditService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  authenticate(identityId: string, ttlMinutes = 15): {
    session: AuthenticationSession;
    accessToken: string;
  } {
    const identity = this.identities.get(identityId);

    if (identity.status !== "active") {
      throw new Error("Runtime identity is not active.");
    }

    const accessToken = randomBytes(32).toString("hex");
    const session: AuthenticationSession = {
      id: this.id("auth-session"),
      identityId,
      tokenFingerprint: createHash("sha256")
        .update(accessToken)
        .digest("hex"),
      issuedAt: this.now(),
      expiresAt: new Date(Date.now() + ttlMinutes * 60_000).toISOString(),
      status: "active",
    };

    this.store.writeJson(`sessions/${session.id}.json`, session);
    this.audit.record({
      category: "authentication",
      action: "issue-session",
      actor: identity.runtimeKey,
      subject: session.id,
      outcome: "success",
      metadata: { expiresAt: session.expiresAt },
    });

    return { session, accessToken };
  }

  validate(sessionId: string, accessToken: string): boolean {
    const session = this.list().find((item) => item.id === sessionId);

    if (!session || session.status !== "active") {
      return false;
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      return false;
    }

    const fingerprint = createHash("sha256")
      .update(accessToken)
      .digest("hex");

    return fingerprint === session.tokenFingerprint;
  }

  list(): AuthenticationSession[] {
    return this.store.listJson<AuthenticationSession>("sessions");
  }
}