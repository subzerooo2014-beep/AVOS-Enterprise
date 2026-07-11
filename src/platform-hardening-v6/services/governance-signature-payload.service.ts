import { Injectable } from "@nestjs/common";

@Injectable()
export class GovernanceSignaturePayloadService {
  audit(event: any) {
    return {
      id: event.id,
      sequence: event.sequence,
      eventType: event.eventType,
      severity: event.severity,
      action: event.action,
      message: event.message,
      actor: event.actor ?? null,
      correlationId:
        event.correlationId ?? null,
      traceId: event.traceId ?? null,
      method: event.method ?? null,
      path: event.path ?? null,
      statusCode:
        event.statusCode ?? null,
      metadata: event.metadata ?? {},
      previousHash:
        event.previousHash,
      hash: event.hash,
      createdAt:
        this.toIso(event.createdAt),
    };
  }

  policy(version: any) {
    return {
      id: version.id,
      policyId: version.policyId,
      version: version.version,
      name: version.name,
      description:
        version.description,
      enabled: version.enabled,
      methods: version.methods,
      pathPrefixes:
        version.pathPrefixes,
      requireApprovalToken:
        version.requireApprovalToken,
      blockInProduction:
        version.blockInProduction,
      severity: version.severity,
      changeType:
        version.changeType,
      changeReason:
        version.changeReason ?? null,
      changedBy:
        version.changedBy ?? null,
      correlationId:
        version.correlationId ?? null,
      traceId:
        version.traceId ?? null,
      restoredFromVersion:
        version.restoredFromVersion ?? null,
      checksum:
        version.checksum,
      createdAt:
        this.toIso(version.createdAt),
    };
  }

  private toIso(
    value: Date | string,
  ): string {
    return value instanceof Date
      ? value.toISOString()
      : value;
  }
}
