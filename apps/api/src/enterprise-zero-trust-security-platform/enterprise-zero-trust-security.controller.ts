import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuditCenterService } from "./audit-center.service";
import { AuthorizationCenterService } from "./authorization-center.service";
import { CertificateManagerService } from "./certificate-manager.service";
import { EncryptionEngineService } from "./encryption-engine.service";
import { EnterpriseZeroTrustSecurityService } from "./enterprise-zero-trust-security.service";
import { IdentityRegistryService } from "./identity-registry.service";
import { KeyManagementService } from "./key-management.service";
import { SecretVaultService } from "./secret-vault.service";
import { ThreatDetectionService } from "./threat-detection.service";
import type {
  AuthorizationPolicy,
  CertificateRecord,
  IdentityRecord,
  ThreatRecord,
} from "./zero-trust-security.types";

@Controller("enterprise-zero-trust-security")
export class EnterpriseZeroTrustSecurityController {
  constructor(
    private readonly platform: EnterpriseZeroTrustSecurityService,
    private readonly identities: IdentityRegistryService,
    private readonly authorization: AuthorizationCenterService,
    private readonly secrets: SecretVaultService,
    private readonly keys: KeyManagementService,
    private readonly encryption: EncryptionEngineService,
    private readonly certificates: CertificateManagerService,
    private readonly audits: AuditCenterService,
    private readonly threats: ThreatDetectionService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("identities")
  registerIdentity(
    @Body() body: Omit<IdentityRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, identity: this.identities.register(body) };
  }

  @Post("policies")
  registerPolicy(@Body() body: AuthorizationPolicy) {
    return { success: true, policy: this.authorization.registerPolicy(body) };
  }

  @Post("authorize")
  authorize(
    @Body()
    body: {
      identityId: string;
      action: string;
      resource: string;
      context?: Record<string, unknown>;
    },
  ) {
    const decision = this.authorization.decide(
      body.identityId,
      body.action,
      body.resource,
      body.context ?? {},
    );

    this.audits.record(
      body.identityId,
      body.action,
      body.resource,
      decision.outcome,
      { decisionId: decision.id },
    );

    return { success: true, decision };
  }

  @Post("secrets/:key")
  setSecret(@Param("key") key: string, @Body() body: { value: string }) {
    return { success: true, secret: this.secrets.set(key, body.value) };
  }

  @Post("keys/:id")
  generateKey(
    @Param("id") id: string,
    @Body() body: { algorithm?: string },
  ) {
    return {
      success: true,
      key: this.keys.generate(id, body.algorithm),
    };
  }

  @Post("encrypt")
  encrypt(@Body() body: { keyId: string; plaintext: string }) {
    return {
      success: true,
      encrypted: this.encryption.encrypt(body.keyId, body.plaintext),
    };
  }

  @Post("decrypt")
  decrypt(
    @Body()
    body: {
      keyId: string;
      iv: string;
      tag: string;
      ciphertext: string;
    },
  ) {
    return {
      success: true,
      plaintext: this.encryption.decrypt(body.keyId, body),
    };
  }

  @Post("certificates")
  registerCertificate(@Body() body: CertificateRecord) {
    return {
      success: true,
      certificate: this.certificates.register(body),
    };
  }

  @Post("threats")
  detectThreat(
    @Body()
    body: Omit<ThreatRecord, "id" | "status" | "createdAt">,
  ) {
    return {
      success: true,
      threat: this.threats.detect(body),
    };
  }

  @Post("threats/:id/resolve")
  resolveThreat(@Param("id") id: string) {
    return {
      success: true,
      threat: this.threats.resolve(id),
    };
  }
}
